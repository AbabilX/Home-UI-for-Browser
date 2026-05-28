"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Image01Icon } from "@hugeicons/core-free-icons";
import { useSettingsStore, type SearchEngine } from "@/store/settingsStore";
import { useTranslation } from "@/constants/languages";
import { cn } from "@/lib/utils";
import { SectionLabel } from "../shared/SectionLabel";

const ENGINES: SearchEngine[] = ["google", "duckduckgo", "bing", "brave"];

const ENGINE_LABEL: Record<SearchEngine, string> = {
  google: "Google",
  duckduckgo: "DuckDuckGo",
  bing: "Bing",
  brave: "Brave",
};

export function LayoutSection() {
  const {
    searchEngine,
    tabsPosition,
    language,
    setSearchEngine,
    setTabsPosition,
  } = useSettingsStore();
  const t = useTranslation(language);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* Left Column: Search Engine Selection */}
        <div className="space-y-3">
          <SectionLabel>{t("searchEngine")}</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            {ENGINES.map((engine) => (
              <button
                key={engine}
                onClick={() => setSearchEngine(engine)}
                className={cn(
                  "group flex items-center justify-between rounded-xl border-2 p-4 text-sm font-semibold transition-all relative",
                  searchEngine === engine
                    ? "border-primary bg-primary/5 text-foreground shadow-sm"
                    : "border-border/40 text-muted-foreground hover:border-primary/30 hover:bg-accent/40",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-muted/20">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      size={16}
                      strokeWidth={1.5}
                      className="text-primary"
                    />
                  </div>
                  <span>{ENGINE_LABEL[engine]}</span>
                </div>
                {searchEngine === engine && (
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Shortcut Position Placement */}
        <div className="space-y-3">
          <SectionLabel>{t("shortcutPosition")}</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            {(["top", "center"] as const).map((pos) => (
              <button
                key={pos}
                onClick={() => setTabsPosition(pos)}
                className={cn(
                  "group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-5 text-xs font-semibold transition-all relative overflow-hidden h-28",
                  tabsPosition === pos
                    ? "border-primary bg-primary/5 text-foreground shadow-md ring-1 ring-primary/20"
                    : "border-border/40 text-muted-foreground hover:border-primary/30 hover:bg-accent/40",
                )}
              >
                <div className="p-2.5 rounded-xl bg-muted/20 group-hover:scale-110 transition-transform">
                  <HugeiconsIcon
                    icon={Image01Icon}
                    size={20}
                    strokeWidth={1.5}
                    className="text-primary"
                  />
                </div>
                <span className="capitalize leading-none">{t(pos)}</span>
                {tabsPosition === pos && (
                  <div className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
