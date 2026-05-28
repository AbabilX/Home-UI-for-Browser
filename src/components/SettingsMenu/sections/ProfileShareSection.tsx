"use client";

import { useRef, useState } from "react";
import { useTheme } from "next-themes";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon, Upload01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSettingsStore } from "@/store/settingsStore";
import { useTranslation } from "@/constants/languages";
import {
  exportShareProfile,
  importShareProfile,
} from "@/lib/shareProfileStore";
import { parseShareProfile, type ShareProfileV1 } from "@/lib/shareProfile";

export function ProfileShareSection() {
  const { language } = useSettingsStore();
  const { setTheme } = useTheme();
  const t = useTranslation(language);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingProfile, setPendingProfile] = useState<ShareProfileV1 | null>(
    null,
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = () => {
    try {
      const profile = exportShareProfile();
      const blob = new Blob([JSON.stringify(profile, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `launchtab-profile-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert(t("profileExportFailed"));
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.currentTarget.value = "";
    if (!file) return;
    try {
      const { data, error } = parseShareProfile(
        JSON.parse(await file.text()) as unknown,
      );
      if (!data) {
        alert(error ?? t("profileImportInvalid"));
        return;
      }
      setPendingProfile(data);
      setIsConfirmOpen(true);
    } catch {
      alert(t("profileImportInvalid"));
    }
  };

  const applyImport = () => {
    if (!pendingProfile) return;
    setIsImporting(true);
    try {
      const result = importShareProfile(pendingProfile);
      if (!result.applied) {
        alert(result.error ?? t("profileImportFailed"));
        return;
      }
      if (result.theme) setTheme(result.theme);
      setIsConfirmOpen(false);
      setPendingProfile(null);
      alert(t("profileImportSuccess"));
    } catch {
      alert(t("profileImportFailed"));
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
          {/* Left Column: Description */}
          <div className="flex flex-col justify-between rounded-2xl border border-border/20 bg-muted/10 p-5 transition-all hover:bg-muted/15">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Workspace Profile Sync
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Export your configured dashboard layouts, bookmarks, background
                settings, and aesthetic configurations as a portable backup JSON
                file.
              </p>
              <p className="text-[10px] text-muted-foreground/80 mt-3 leading-relaxed">
                You can import this backup profile at any time on another
                computer or browser to instantly restore your personalized
                dashboard environment.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-border/10">
              <span className="text-[9px] font-black uppercase tracking-widest text-primary/75">
                Portable JSON Format v1
              </span>
            </div>
          </div>

          {/* Right Column: Actions */}
          <div className="grid grid-cols-1 gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleImportFile}
            />
            <button
              onClick={handleExport}
              className="group flex items-center gap-4 rounded-xl border border-border/30 bg-muted/10 p-4 text-left font-medium text-foreground transition-all hover:border-primary/40 hover:bg-accent/40"
            >
              <div className="p-3.5 rounded-xl bg-muted/30 group-hover:scale-110 transition-transform">
                <HugeiconsIcon
                  icon={Download01Icon}
                  size={20}
                  strokeWidth={1.5}
                  className="text-primary"
                />
              </div>
              <div>
                <span className="text-xs font-bold leading-none block">
                  {t("exportProfile")}
                </span>
                <span className="text-[9px] text-muted-foreground leading-normal mt-0.5 block">
                  Create portable backup file
                </span>
              </div>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="group flex items-center gap-4 rounded-xl border border-border/30 bg-muted/10 p-4 text-left font-medium text-foreground transition-all hover:border-primary/40 hover:bg-accent/40"
            >
              <div className="p-3.5 rounded-xl bg-muted/30 group-hover:scale-110 transition-transform">
                <HugeiconsIcon
                  icon={Upload01Icon}
                  size={20}
                  strokeWidth={1.5}
                  className="text-primary"
                />
              </div>
              <div>
                <span className="text-xs font-bold leading-none block">
                  {t("importProfile")}
                </span>
                <span className="text-[9px] text-muted-foreground leading-normal mt-0.5 block">
                  Restore portable backup file
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <Dialog
        open={isConfirmOpen}
        onOpenChange={(open) => {
          setIsConfirmOpen(open);
          if (!open) setPendingProfile(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogTitle>{t("importProfileConfirmTitle")}</DialogTitle>
          <DialogDescription>
            {t("importProfileConfirmDescription")}
          </DialogDescription>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsConfirmOpen(false);
                setPendingProfile(null);
              }}
              disabled={isImporting}
            >
              {t("cancel")}
            </Button>
            <Button onClick={applyImport} disabled={isImporting}>
              {isImporting ? t("loading") : t("importProfile")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
