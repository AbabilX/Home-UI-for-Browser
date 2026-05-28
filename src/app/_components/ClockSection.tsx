import DigitalClock from "@/components/Home/ClockZone/Clock";

interface ClockSectionProps {
  clockPosition: string;
  layoutPreset: string;
}

const paddingByPreset: Record<string, string> = {
  compact: "pt-0 pb-1 px-2",
  focus: "pt-2 pb-2 px-6",
};

const alignByPosition: Record<string, string> = {
  "top-left": "start",
  "top-center": "center",
};

export function ClockSection({
  clockPosition,
  layoutPreset,
}: ClockSectionProps) {
  const paddingClass = paddingByPreset[layoutPreset] ?? "pt-1 pb-1 px-4";
  const align = alignByPosition[clockPosition] ?? "end";

  return (
    <div className={`flex justify-${align} ${paddingClass}`}>
      <DigitalClock />
    </div>
  );
}
