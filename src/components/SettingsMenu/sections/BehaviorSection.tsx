"use client";

import { useSettingsStore } from "@/store/settingsStore";
import { useTranslation } from "@/constants/languages";
import { ToggleRow } from "../shared/ToggleRow";
import { SectionLabel } from "../shared/SectionLabel";

export function BehaviorSection() {
  const {
    language,
    autoOrderTabs,
    showRightSidebar,
    autoFocusSearch,
    enableLeftSidebarHover,
    enableSearchHoverZone,
    toggleAutoOrderTabs,
    toggleShowRightSidebar,
    toggleAutoFocusSearch,
    toggleLeftSidebarHover,
    toggleSearchHoverZone,
  } = useSettingsStore();
  const t = useTranslation(language);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* Left Column: Interface Toggles */}
        <div className="space-y-3 bg-muted/10 p-4 rounded-2xl border border-border/20 transition-all hover:bg-muted/15">
          <SectionLabel>Interface Zones</SectionLabel>
          <div className="space-y-1">
            <ToggleRow
              label={t("showRightSidebar")}
              checked={showRightSidebar}
              onChange={toggleShowRightSidebar}
            />
            <ToggleRow
              label={t("enableLeftSidebarHover")}
              checked={enableLeftSidebarHover}
              onChange={toggleLeftSidebarHover}
            />
            <ToggleRow
              label={t("enableSearchHoverZone")}
              checked={enableSearchHoverZone}
              onChange={toggleSearchHoverZone}
            />
          </div>
        </div>

        {/* Right Column: Automation & Focus */}
        <div className="space-y-3 bg-muted/10 p-4 rounded-2xl border border-border/20 transition-all hover:bg-muted/15">
          <SectionLabel>Automation & Focus</SectionLabel>
          <div className="space-y-1">
            <ToggleRow
              label={t("autoOrderTabs")}
              checked={autoOrderTabs}
              onChange={toggleAutoOrderTabs}
            />
            <ToggleRow
              label={t("autoFocusSearch")}
              checked={autoFocusSearch}
              onChange={toggleAutoFocusSearch}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
