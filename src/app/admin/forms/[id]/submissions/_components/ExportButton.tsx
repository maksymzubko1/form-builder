'use client';

import type { FC } from "react";
import { API_ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportButtonProps {
  formId: string;
}

export const ExportButton: FC<ExportButtonProps> = ({ formId }) => {
  function handleExport(): void {
    window.open(API_ROUTES.FORM_SUBMISSIONS_EXPORT(formId), "_blank");
  }
  return (
    <Button type="button" variant="outline" onClick={handleExport} className="flex items-center gap-2">
      <Download className="w-4 h-4" /> Export CSV
    </Button>
  );
};
