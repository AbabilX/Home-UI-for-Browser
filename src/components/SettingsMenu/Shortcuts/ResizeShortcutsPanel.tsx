"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useSettingsStore } from "@/store/settingsStore";
import { toast } from "sonner";

interface ResizeShortcutsPanelProps {
  onBack?: () => void;
}

export function ResizeShortcutsPanel({ onBack }: ResizeShortcutsPanelProps) {
  const { cardSize, cardRadius, setCardSize, setCardRadius } =
    useSettingsStore();
  const [tempSize, setTempSize] = useState(cardSize);
  const [tempRadius, setTempRadius] = useState(cardRadius);

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

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          {/* Left Column: Sliders */}
          <div className="space-y-5 bg-muted/10 p-5 rounded-2xl border border-border/20 transition-all hover:bg-muted/15">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Card Size</span>
                <span className="text-xs text-muted-foreground tabular-nums font-bold">
                  {tempSize.toFixed(1)} rem
                </span>
              </div>
              <Slider
                value={[tempSize]}
                onValueChange={(v) => setTempSize(v[0])}
                min={1}
                max={10}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground/60 font-medium">
                <span>Small (1rem)</span>
                <span>Large (10rem)</span>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-border/10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Card Radius</span>
                <span className="text-xs text-muted-foreground tabular-nums font-bold">
                  {tempRadius.toFixed(1)} rem
                </span>
              </div>
              <Slider
                value={[tempRadius]}
                onValueChange={(v) => setTempRadius(v[0])}
                min={0.5}
                max={3}
                step={0.25}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground/60 font-medium">
                <span>Sharp (0.5rem)</span>
                <span>Round (3rem)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Mockup Card Preview */}
          <div className="space-y-3 bg-muted/10 p-5 rounded-2xl border border-border/20 transition-all hover:bg-muted/15 h-full flex flex-col justify-between">
            <div>
              <span className="text-sm font-semibold">
                Interactive Mockup Preview
              </span>
              <p className="text-[10px] text-muted-foreground mt-1 mb-4 leading-normal">
                Observe how the card dimensions, scales, and border rounding
                respond instantly to your slider inputs.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center bg-black/20 p-6 rounded-xl border border-white/5 flex-1 min-h-[140px]">
              <div
                className="border bg-card flex items-center justify-center shadow-lg transition-all duration-300"
                style={{
                  width: `${tempSize * 0.9}rem`,
                  height: `${tempSize * 0.65}rem`,
                  borderRadius: `${tempRadius}rem`,
                }}
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-black text-primary select-none">
                  A
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground mt-4 font-black uppercase tracking-widest leading-none">
                {tempSize < 6
                  ? "Compact"
                  : tempSize < 8
                    ? "Medium"
                    : "Spacious"}{" "}
                ·{" "}
                {tempRadius < 1
                  ? "Sharp"
                  : tempRadius < 2
                    ? "Rounded"
                    : "Round"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-3 border-t border-border/10 shrink-0 justify-end">
        <Button
          variant="outline"
          size="sm"
          className="w-auto px-6 h-9 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/5"
          onClick={() => {
            setTempSize(cardSize);
            setTempRadius(cardRadius);
            onBack?.();
          }}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          className="w-auto px-6 h-9 rounded-xl font-bold text-xs uppercase tracking-widest bg-primary hover:bg-primary/95 shadow-lg shadow-primary/10"
          onClick={() => {
            setCardSize(tempSize);
            setCardRadius(tempRadius);
            toast.success("Shortcut sizes updated");
            onBack?.();
          }}
        >
          Apply
        </Button>
      </div>
    </div>
  );
}
