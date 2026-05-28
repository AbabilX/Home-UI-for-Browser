"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import {
  useSettingsStore,
  DEFAULT_DYNAMIC_WALLPAPERS,
  normalizeDynamicWallpaper,
  type DynamicWallpaperMode,
} from "@/store/settingsStore";
import { cn } from "@/lib/utils";
import { SectionLabel } from "../shared/SectionLabel";
import { ToggleRow } from "../shared/ToggleRow";

const MODES: { value: DynamicWallpaperMode; label: string; desc: string }[] = [
  { value: "auto", label: "Auto", desc: "All images" },
  { value: "theme", label: "Theme", desc: "Light / dark" },
  { value: "time", label: "Time", desc: "Day / night" },
];

function WallpaperPool({
  mode,
  resolvedTheme,
}: {
  mode: DynamicWallpaperMode;
  resolvedTheme: string | undefined;
}) {
  const all = DEFAULT_DYNAMIC_WALLPAPERS.map(normalizeDynamicWallpaper);

  let pool: typeof all;
  let poolLabel: string;

  if (mode === "auto") {
    pool = all;
    poolLabel = `All ${all.length} wallpapers in pool`;
  } else if (mode === "theme") {
    const activeTheme = resolvedTheme === "dark" ? "dark" : "light";
    pool = all.filter((w) => w.mode === "both" || w.mode === activeTheme);
    poolLabel = `${pool.length} wallpapers for ${activeTheme} mode`;
  } else {
    const hour = new Date().getHours();
    const isDayTime = hour >= 6 && hour < 18;
    const timeTheme = isDayTime ? "light" : "dark";
    pool = all.filter((w) => w.mode === "both" || w.mode === timeTheme);
    poolLabel = `${pool.length} wallpapers for ${isDayTime ? "day" : "night"} (${hour}:00)`;
  }

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-muted-foreground">{poolLabel}</p>
      <div className="flex flex-wrap gap-1.5">
        {pool.map((w, idx) => (
          <div
            key={w.url}
            className="relative h-10 w-14 overflow-hidden rounded-lg border border-border/40"
          >
            <Image
              src={w.url}
              alt={`Pool ${idx}`}
              width={56}
              height={40}
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-0.5 right-0.5 rounded bg-black/55 px-0.5 text-[7px] font-semibold uppercase leading-3 text-white">
              {w.mode === "both" ? "all" : w.mode.charAt(0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WallpaperSection() {
  const {
    backgroundImage,
    isDynamicWallpaper,
    dynamicWallpaperMode,
    setBackgroundImage,
    setDynamicWallpaper,
    setDynamicWallpaperMode,
  } = useSettingsStore();
  const { resolvedTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDynamicWallpaper(false);
      setBackgroundImage(file);
    }
  };

  const handleWallpaperClick = async (url: string) => {
    if (backgroundImage === url && !isDynamicWallpaper) {
      setDynamicWallpaper(true);
      await setBackgroundImage(null);
      return;
    }
    setDynamicWallpaper(false);
    await setBackgroundImage(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Dynamic Settings & Modes */}
        <div className="xl:col-span-5 space-y-4">
          <div className="rounded-xl border border-border/30 bg-muted/10 p-3.5 space-y-3 transition-all hover:bg-muted/15">
            <SectionLabel>Dynamic Wallpaper</SectionLabel>
            <ToggleRow
              label="Randomize on every refresh"
              checked={isDynamicWallpaper}
              onChange={() => setDynamicWallpaper(!isDynamicWallpaper)}
            />
          </div>

          {isDynamicWallpaper && (
            <div className="rounded-xl border border-border/30 bg-muted/10 p-4 space-y-3 transition-all hover:bg-muted/15">
              <SectionLabel>Wallpaper Mode</SectionLabel>
              <div className="grid grid-cols-3 gap-1.5">
                {MODES.map(({ value, label, desc }) => (
                  <button
                    key={value}
                    onClick={() => setDynamicWallpaperMode(value)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-0.5 rounded-xl border-2 p-2 text-[10px] font-semibold transition-all h-16",
                      dynamicWallpaperMode === value
                        ? "border-primary bg-primary/5 text-foreground shadow"
                        : "border-border/40 text-muted-foreground hover:border-primary/30 hover:bg-accent/40",
                    )}
                  >
                    <span className="font-bold leading-tight">{label}</span>
                    <span className="text-[8px] opacity-70 leading-tight">
                      {desc}
                    </span>
                  </button>
                ))}
              </div>
              <div className="pt-2 border-t border-border/10">
                <WallpaperPool
                  mode={dynamicWallpaperMode}
                  resolvedTheme={resolvedTheme}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Wallpaper Gallery Selection */}
        <div className="xl:col-span-7 space-y-3">
          <SectionLabel>Gallery</SectionLabel>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
          />
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 bg-muted/5 p-4 rounded-2xl border border-border/20 max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/10 scrollbar-track-transparent">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center rounded-xl border-2 border-dashed border-border/40 bg-muted/10 hover:border-primary/50 hover:bg-muted/20 transition-all h-16 sm:h-20 shrink-0"
              title="Upload Custom Image"
            >
              <HugeiconsIcon
                icon={Add01Icon}
                size={20}
                strokeWidth={1.5}
                className="text-muted-foreground"
              />
            </button>
            {DEFAULT_DYNAMIC_WALLPAPERS.map((wallpaper, idx) => {
              const { url, mode } = normalizeDynamicWallpaper(wallpaper);
              const isActive = backgroundImage === url;

              return (
                <button
                  key={url}
                  onClick={() => handleWallpaperClick(url)}
                  className={cn(
                    "group relative overflow-hidden rounded-xl border-2 transition-all h-16 sm:h-20 shrink-0 shadow-sm",
                    isActive
                      ? isDynamicWallpaper
                        ? "border-violet-500 scale-[1.03] ring-2 ring-violet-500/20"
                        : "border-primary scale-[1.03] ring-2 ring-primary/20"
                      : "border-transparent opacity-75 hover:opacity-100 hover:scale-[1.02]",
                  )}
                >
                  <Image
                    src={url}
                    alt={`Wallpaper ${idx}`}
                    width={100}
                    height={70}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Auto change active indicator */}
                  {isActive && isDynamicWallpaper && (
                    <span className="absolute top-1 left-1 bg-violet-600/90 text-[6px] text-white px-1.5 py-0.5 rounded font-black uppercase tracking-wider select-none animate-pulse leading-none">
                      Auto
                    </span>
                  )}

                  <span className="absolute bottom-0.5 right-0.5 rounded bg-black/55 px-1 text-[7px] font-semibold uppercase leading-tight text-white select-none">
                    {mode === "both" ? "all" : mode.charAt(0)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
