import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { RefObject } from "react";
import type { Toast } from "primereact/toast";
import { DDIApi } from "../../sdk";
import { TOAST_DURATION } from "../physical-instances/constants";
import type { PhysicalInstanceResponse } from "../physical-instances/types/api";

export const useExport = (
  data: PhysicalInstanceResponse,
  title: string,
  toast: RefObject<Toast>,
) => {
  const { t } = useTranslation();

  const handleExport = useCallback(
    async (format: "DDI3" | "DDI4") => {
      try {
        let exportedData: string;
        let fileName: string;
        const sanitizedTitle = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();

        if (format === "DDI3") {
          const result = await DDIApi.convertToDDI3(data);
          exportedData = result;
          fileName = `${sanitizedTitle}-ddi3.xml`;
        } else {
          exportedData = JSON.stringify(data, null, 2);
          fileName = `${sanitizedTitle}-ddi4.json`;
        }

        const blob = new Blob([exportedData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.current?.show({
          severity: "success",
          summary: t("physicalInstance.view.exportSuccess"),
          detail: t("physicalInstance.view.exportSuccessDetail", { format }),
          life: TOAST_DURATION,
        });
      } catch (err) {
        toast.current?.show({
          severity: "error",
          summary: t("physicalInstance.view.exportError"),
          detail: err instanceof Error ? err.message : t("physicalInstance.view.exportErrorDetail"),
          life: TOAST_DURATION,
        });
      }
    },
    [data, title, t, toast],
  );

  return handleExport;
};
