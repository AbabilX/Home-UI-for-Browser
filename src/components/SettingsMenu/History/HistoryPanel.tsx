"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Delete02Icon,
  Search01Icon,
  Globe02Icon,
  TimeScheduleIcon,
} from "@hugeicons/core-free-icons";
import { useTranslation } from "@/constants/languages";
import { useSettingsStore } from "@/store/settingsStore";
import { useSearchHistoryStore } from "@/store/searchHistoryStore";
import { useTabClickHistoryStore } from "@/store/tabClickHistoryStore";

interface HistoryPanelProps {
  onBack?: () => void;
}

export function HistoryPanel({ onBack }: HistoryPanelProps) {
  const language = useSettingsStore((s) => s.language);
  const t = useTranslation(language);

  const searchEntries = useSearchHistoryStore((s) => s.entries);
  const removeSearchEntry = useSearchHistoryStore(
    (s) => s.removeSearchHistoryEntry,
  );
  const tabEntries = useTabClickHistoryStore((s) => s.entries);
  const removeTabEntry = useTabClickHistoryStore(
    (s) => s.removeTabClickHistoryEntry,
  );

  const entries = [
    ...searchEntries.map((e) => ({
      id: `search-${e.id}`,
      entryId: e.id,
      type: "search" as const,
      primary: e.value,
      secondary: t("searchEntry"),
    })),
    ...tabEntries.map((e) => ({
      id: `tab-${e.id}`,
      entryId: e.id,
      type: "tab" as const,
      primary: e.title,
      secondary: e.url,
    })),
  ];

  return (
    <div className="flex flex-col gap-4 h-full">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={13} strokeWidth={2} />
          Back
        </button>
      )}

      {entries.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          {/* Left Column: Search History */}
          <div className="space-y-3 bg-muted/10 p-4 rounded-2xl border border-border/20 transition-all hover:bg-muted/15 flex flex-col h-[52vh]">
            <h3 className="text-xs font-black uppercase tracking-widest text-primary/80 mb-1">
              Search Queries
            </h3>
            {entries.filter((e) => e.type === "search").length > 0 ? (
              <div className="space-y-2 overflow-y-auto flex-1 pr-1 scrollbar-thin scrollbar-thumb-muted-foreground/10 scrollbar-track-transparent">
                {entries
                  .filter((e) => e.type === "search")
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/50 p-2.5 hover:bg-accent/40 transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-muted/40 text-muted-foreground shrink-0">
                        <HugeiconsIcon
                          icon={Search01Icon}
                          size={13}
                          strokeWidth={2}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {entry.primary}
                        </p>
                        <p className="text-[9px] text-muted-foreground truncate uppercase font-bold tracking-wider">
                          {entry.secondary}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSearchEntry(entry.entryId)}
                        className="h-7 w-7 flex items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
                      >
                        <HugeiconsIcon
                          icon={Delete02Icon}
                          size={14}
                          strokeWidth={2}
                        />
                      </button>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-center py-6">
                <p className="text-xs font-semibold text-muted-foreground/50">
                  No search logs
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Visited Links */}
          <div className="space-y-3 bg-muted/10 p-4 rounded-2xl border border-border/20 transition-all hover:bg-muted/15 flex flex-col h-[52vh]">
            <h3 className="text-xs font-black uppercase tracking-widest text-primary/80 mb-1">
              Visited Shortcuts
            </h3>
            {entries.filter((e) => e.type === "tab").length > 0 ? (
              <div className="space-y-2 overflow-y-auto flex-1 pr-1 scrollbar-thin scrollbar-thumb-muted-foreground/10 scrollbar-track-transparent">
                {entries
                  .filter((e) => e.type === "tab")
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/50 p-2.5 hover:bg-accent/40 transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-muted/40 text-muted-foreground shrink-0">
                        <HugeiconsIcon
                          icon={Globe02Icon}
                          size={13}
                          strokeWidth={2}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {entry.primary}
                        </p>
                        <p className="text-[9px] text-muted-foreground truncate font-medium">
                          {entry.secondary}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTabEntry(entry.entryId)}
                        className="h-7 w-7 flex items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
                      >
                        <HugeiconsIcon
                          icon={Delete02Icon}
                          size={14}
                          strokeWidth={2}
                        />
                      </button>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-center py-6">
                <p className="text-xs font-semibold text-muted-foreground/50">
                  No clicked bookmarks
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 rounded-xl border border-dashed border-border/40 text-center py-16">
          <HugeiconsIcon
            icon={TimeScheduleIcon}
            size={28}
            strokeWidth={1.5}
            className="text-muted-foreground/40 mb-2"
          />
          <p className="text-sm font-medium text-foreground">
            {t("noHistory")}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {t("historyEmptyDescription")}
          </p>
        </div>
      )}
    </div>
  );
}
