"use client";

import { useTheme } from "next-themes";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Sun01Icon,
  Moon01Icon,
  ColorsIcon,
  LanguageCircleIcon,
} from "@hugeicons/core-free-icons";
import { useSettingsStore, type Theme } from "@/store/settingsStore";
import { type Language, useTranslation } from "@/constants/languages";
import { cn } from "@/lib/utils";
import { SectionLabel } from "../shared/SectionLabel";

export function AppearanceSection() {
  const {
    theme,
    language,
    setTheme: setSettingsTheme,
    setLanguage,
  } = useSettingsStore();
  const { setTheme } = useTheme();
  const t = useTranslation(language);

  const handleThemeChange = (newTheme: Theme) => {
    setSettingsTheme(newTheme);
    setTheme(newTheme);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Theme Selection */}
        <div className="xl:col-span-7 space-y-3">
          <SectionLabel>{t("theme")}</SectionLabel>
          <div className="grid grid-cols-3 gap-3">
            {(["light", "dark", "system"] as Theme[]).map((th) => (
              <button
                key={th}
                onClick={() => handleThemeChange(th)}
                className={cn(
                  "group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-5 text-xs font-semibold transition-all relative overflow-hidden h-28",
                  theme === th
                    ? "border-primary bg-primary/5 text-foreground shadow-md ring-1 ring-primary/20"
                    : "border-border/40 text-muted-foreground hover:border-primary/30 hover:bg-accent/40",
                )}
              >
                <div className="p-2.5 rounded-xl bg-muted/20 group-hover:scale-110 transition-transform">
                  <HugeiconsIcon
                    icon={
                      th === "light"
                        ? Sun01Icon
                        : th === "dark"
                          ? Moon01Icon
                          : ColorsIcon
                    }
                    size={20}
                    strokeWidth={1.5}
                    className="text-primary"
                  />
                </div>
                <span className="capitalize leading-none">{t(th)}</span>
                {theme === th && (
                  <div className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Language Selection */}
        <div className="xl:col-span-5 space-y-3">
          <SectionLabel>{t("language")}</SectionLabel>
          <div className="grid grid-cols-1 gap-3">
            {(["en", "bn"] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={cn(
                  "group flex items-center justify-between rounded-xl border-2 p-4 text-sm font-semibold transition-all relative",
                  language === lang
                    ? "border-primary bg-primary/5 text-foreground shadow-sm"
                    : "border-border/40 text-muted-foreground hover:border-primary/30 hover:bg-accent/40",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-muted/20">
                    <HugeiconsIcon
                      icon={LanguageCircleIcon}
                      size={18}
                      strokeWidth={1.5}
                      className="text-primary"
                    />
                  </div>
                  <span>{lang === "en" ? "English (EN)" : "বাংলা (BN)"}</span>
                </div>
                {language === lang && (
                  <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full uppercase tracking-wider font-black">
                    Active
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
