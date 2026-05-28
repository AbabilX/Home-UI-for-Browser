"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Clock01Icon,
  ColorPickerIcon,
  TimeSetting01Icon,
  MoveIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSettingsStore, ClockPosition } from "@/store/settingsStore";
import { getTranslation } from "@/constants/languages";
import { toast } from "sonner";

const CLOCK_COLORS = [
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#ffffff",
  "#f97316",
];

const CLOCK_POSITIONS: { value: ClockPosition; label: string }[] = [
  { value: "top-left", label: "Left" },
  { value: "top-center", label: "Center" },
  { value: "top-right", label: "Right" },
];

interface ClockSettingsPanelProps {
  onBack?: () => void;
}

export function ClockSettingsPanel({ onBack }: ClockSettingsPanelProps) {
  const {
    language,
    showClock,
    clockColor,
    showClockGlow,
    clockFormat,
    showSeconds,
    clockPosition,
    clockStyle,
    toggleShowClock,
    setClockColor,
    setShowClockGlow,
    setClockFormat,
    setShowSeconds,
    setClockPosition,
    setClockStyle,
  } = useSettingsStore();

  const t = (key: string) => getTranslation(language, key);

  const [tempShow, setTempShow] = useState(showClock);
  const [tempColor, setTempColor] = useState(clockColor);
  const [tempGlow, setTempGlow] = useState(showClockGlow);
  const [tempFormat, setTempFormat] = useState(clockFormat);
  const [tempSeconds, setTempSeconds] = useState(showSeconds);
  const [tempPosition, setTempPosition] =
    useState<ClockPosition>(clockPosition);
  const [tempStyle, setTempStyle] = useState(clockStyle);

  // Re-sync when store changes externally
  useEffect(() => {
    setTempShow(showClock);
    setTempColor(clockColor);
    setTempGlow(showClockGlow);
    setTempFormat(clockFormat);
    setTempSeconds(showSeconds);
    setTempPosition(clockPosition);
    setTempStyle(clockStyle);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    if (tempShow !== showClock) toggleShowClock();
    setClockColor(tempColor);
    setShowClockGlow(tempGlow);
    setClockFormat(tempFormat);
    setShowSeconds(tempSeconds);
    setClockPosition(tempPosition);
    setClockStyle(tempStyle);
    toast.success("Clock settings updated");
    onBack?.();
  };

  return (
    <div className="flex flex-col h-full space-y-4 justify-between">
      <div className="overflow-y-auto flex-1 pr-1 space-y-4 scrollbar-thin scrollbar-thumb-muted-foreground/10 scrollbar-track-transparent">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={13} strokeWidth={2} />
            Back
          </button>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
          {/* Left Column: Properties */}
          <div className="space-y-4">
            {/* Visibility */}
            <div className="flex items-center justify-between rounded-xl border border-border/30 bg-muted/10 p-3.5 transition-all hover:bg-muted/15">
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={ViewIcon}
                  size={15}
                  strokeWidth={2}
                  className="text-primary"
                />
                <span className="text-sm font-medium">Visibility</span>
              </div>
              <button
                onClick={() => setTempShow(!tempShow)}
                className={cn(
                  "relative h-5 w-10 rounded-full transition-all duration-300",
                  tempShow ? "bg-primary" : "bg-muted",
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition-all duration-300",
                    tempShow ? "translate-x-5.5" : "translate-x-0.5",
                  )}
                />
              </button>
            </div>

            {/* Position */}
            <div className="rounded-xl border border-border/30 bg-muted/10 p-3.5 space-y-2 transition-all hover:bg-muted/15">
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={MoveIcon}
                  size={15}
                  strokeWidth={2}
                  className="text-primary"
                />
                <span className="text-sm font-medium">Position</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {CLOCK_POSITIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTempPosition(opt.value)}
                    className={cn(
                      "py-1.5 rounded-lg text-xs font-semibold transition-all",
                      tempPosition === opt.value
                        ? "bg-primary text-primary-foreground shadow"
                        : "bg-muted/40 text-muted-foreground hover:bg-muted/80",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Format */}
            <div className="rounded-xl border border-border/30 bg-muted/10 p-3.5 space-y-2 transition-all hover:bg-muted/15">
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={TimeSetting01Icon}
                  size={15}
                  strokeWidth={2}
                  className="text-primary"
                />
                <span className="text-sm font-medium">Format</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {(["12h", "24h"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setTempFormat(f)}
                    className={cn(
                      "py-1.5 rounded-lg text-xs font-semibold transition-all",
                      tempFormat === f
                        ? "bg-primary text-primary-foreground shadow"
                        : "bg-muted/40 text-muted-foreground hover:bg-muted/80",
                    )}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-muted-foreground font-medium">
                  Show seconds
                </span>
                <button
                  onClick={() => setTempSeconds(!tempSeconds)}
                  className={cn(
                    "relative h-5 w-10 rounded-full transition-all duration-300",
                    tempSeconds ? "bg-primary" : "bg-muted",
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition-all duration-300",
                      tempSeconds ? "translate-x-5.5" : "translate-x-0.5",
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Color */}
            <div className="rounded-xl border border-border/30 bg-muted/10 p-3.5 space-y-2 transition-all hover:bg-muted/15">
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={ColorPickerIcon}
                  size={15}
                  strokeWidth={2}
                  className="text-primary"
                />
                <span className="text-sm font-medium">Color</span>
              </div>
              <div className="flex flex-wrap gap-2 py-1">
                {CLOCK_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setTempColor(c)}
                    className={cn(
                      "w-6 h-6 rounded-lg border-2 transition-all hover:scale-110",
                      tempColor === c
                        ? "border-primary ring-2 ring-primary/20 scale-110"
                        : "border-background/50",
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <input
                  type="color"
                  value={tempColor}
                  onChange={(e) => setTempColor(e.target.value)}
                  className="w-6 h-6 rounded-lg border-0 cursor-pointer bg-transparent"
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-muted-foreground font-medium">
                  Glow effect
                </span>
                <button
                  onClick={() => setTempGlow(!tempGlow)}
                  className={cn(
                    "relative h-5 w-10 rounded-full transition-all duration-300",
                    tempGlow ? "bg-primary" : "bg-muted",
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition-all duration-300",
                      tempGlow ? "translate-x-5.5" : "translate-x-0.5",
                    )}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Clock Face Preview Selector */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border/30 bg-muted/10 p-4 space-y-3 transition-all hover:bg-muted/15 h-full">
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Clock01Icon}
                  size={15}
                  strokeWidth={2}
                  className="text-primary"
                />
                <span className="text-sm font-semibold">
                  Clock Face Preview Selection
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(
                  [
                    "classic",
                    "modern",
                    "elegant",
                    "futuristic",
                    "retro",
                  ] as const
                ).map((s) => (
                  <button
                    key={s}
                    onClick={() => setTempStyle(s)}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all relative overflow-hidden h-24 text-left",
                      tempStyle === s
                        ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20"
                        : "border-border/30 bg-muted/5 hover:border-primary/30",
                      s === "retro" && "sm:col-span-2",
                    )}
                  >
                    <div className="absolute top-1.5 right-2 opacity-30 select-none">
                      <span className="text-[7px] font-black uppercase tracking-wider">
                        {s}
                      </span>
                    </div>
                    <span
                      className="text-2xl font-bold tracking-wider text-foreground"
                      style={{
                        color: tempStyle === s ? tempColor : "currentColor",
                        fontFamily:
                          s === "modern"
                            ? "var(--font-fredoka)"
                            : s === "elegant"
                              ? "var(--font-righteous)"
                              : s === "futuristic"
                                ? "var(--font-orbitron)"
                                : s === "retro"
                                  ? "var(--font-vt323)"
                                  : "var(--font-share-tech-mono)",
                        letterSpacing:
                          s === "modern"
                            ? "-0.02em"
                            : s === "elegant"
                              ? "0.03em"
                              : s === "futuristic"
                                ? "0.05em"
                                : s === "retro"
                                  ? "0.04em"
                                  : "0.02em",
                      }}
                    >
                      12:34
                    </span>
                    <span className="text-[9px] text-muted-foreground mt-0.5 uppercase tracking-widest font-bold">
                      {s} Face
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-3 border-t border-border/10 shrink-0 justify-end">
        <Button
          variant="outline"
          size="sm"
          className="w-auto px-6 h-9 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/5"
          onClick={onBack}
        >
          {t("cancel")}
        </Button>
        <Button
          size="sm"
          className="w-auto px-6 h-9 rounded-xl font-bold text-xs uppercase tracking-widest bg-primary hover:bg-primary/95 shadow-lg shadow-primary/10"
          onClick={handleSave}
        >
          {t("saveChanges")}
        </Button>
      </div>
    </div>
  );
}
