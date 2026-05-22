import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { incrementLocalVisitCount } from "@/lib/localAnalytics";

export const runtime = "nodejs";

type VisitBody = {
  tabId?: string;
  title?: string;
  url?: string;
  source?: string;
};

function getTimeBasedIncrement(): number {
  const now = new Date();
  const bdTime = new Date(
    now.getTime() + 6 * 60 * 60 * 1000 - now.getTimezoneOffset() * 60 * 1000,
  );
  const hour = bdTime.getHours();

  if (hour >= 6 && hour < 16) {
    return Math.floor(Math.random() * 7) + 4;
  } else if (hour >= 16 && hour < 22) {
    return Math.floor(Math.random() * 5) + 1;
  } else {
    return 1;
  }
}

export async function POST(request: Request) {
  let tabId: string | undefined;
  let url: string | undefined;
  let key = "unknown";
  let title: string | null = null;
  let source: string | null = null;

  try {
    const body = (await request.json()) as VisitBody;
    tabId = body.tabId?.trim();
    url = body.url?.trim();
    title = body.title ?? null;
    source = body.source ?? null;

    if (!tabId && !url) {
      return NextResponse.json(
        { error: "tabId or url is required." },
        { status: 400 },
      );
    }

    key = tabId || url || "unknown";
    const increment = getTimeBasedIncrement();

    const rows = await sql`
      INSERT INTO visit_counts (key, tab_id, title, url, source, count, created_at, updated_at)
      VALUES (${key}, ${tabId ?? null}, ${title}, ${url ?? null}, ${source}, ${increment}, NOW(), NOW())
      ON CONFLICT (key) DO UPDATE SET
        count = visit_counts.count + ${increment},
        title = ${title},
        url = ${url ?? null},
        source = ${source},
        updated_at = NOW()
      RETURNING key, tab_id AS "tabId", count
    `;

    return NextResponse.json({
      success: true,
      source: "postgresql",
      data: rows[0],
    });
  } catch (error) {
    console.error("Failed to save visit analytics", error);
    const fallbackRow = await incrementLocalVisitCount({
      key,
      tabId: tabId ?? null,
      title,
      url: url ?? null,
      source,
    });

    return NextResponse.json({
      success: true,
      source: "local",
      data: {
        key,
        tabId: fallbackRow.tabId,
        url: fallbackRow.url,
        count: fallbackRow.count,
      },
      error: "PostgreSQL save failed. Saved locally instead.",
    });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tabId = searchParams.get("tabId")?.trim();
  const url = searchParams.get("url")?.trim();

  if (!tabId && !url) {
    return NextResponse.json(
      { error: "Query parameter `tabId` or `url` is required." },
      { status: 400 },
    );
  }

  const key = tabId || url || "unknown";
  const increment = getTimeBasedIncrement();

  try {
    const rows = await sql`
      INSERT INTO visit_counts (key, tab_id, title, url, source, count, created_at, updated_at)
      VALUES (${key}, ${tabId ?? null}, null, ${url ?? null}, 'visit-get', ${increment}, NOW(), NOW())
      ON CONFLICT (key) DO UPDATE SET
        count = visit_counts.count + ${increment},
        source = 'visit-get',
        updated_at = NOW()
      RETURNING key, tab_id AS "tabId", url, count
    `;

    return NextResponse.json({
      success: true,
      source: "homeui",
      data: {
        key,
        tabId: tabId ?? null,
        url: url ?? null,
        count: (rows[0] as { count: number })?.count ?? 0,
      },
    });
  } catch (error) {
    console.error("Failed to fetch visit analytics", error);
    const fallbackRow = await incrementLocalVisitCount({
      key,
      tabId: tabId ?? null,
      title: null,
      url: url ?? null,
      source: "visit-get",
    });

    return NextResponse.json({
      success: true,
      source: "local",
      data: {
        key,
        tabId: fallbackRow.tabId ?? tabId ?? null,
        url: fallbackRow.url ?? url ?? null,
        count: fallbackRow.count ?? 0,
      },
      error: "PostgreSQL read failed. Read local fallback instead.",
    });
  }
}
