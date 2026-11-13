import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@components/buttons/button";
import type { Toast } from "@components/ui/toast";

import { formatApiErrors } from "@utils/api-errors";

import { appI18n } from "../../../../i18n";
import { useEvictCaches } from "../../../hooks/useEvictCaches";
import { errorToastTiming } from "../../../utils/error-toast";
import { DdiToast } from "../../components/DdiToast/DdiToast";

export const EvictCachesButton = () => {
  const { t } = useTranslation();
  const evictCaches = useEvictCaches();
  const toast = useRef<Toast>(null);
  const isEvicting = evictCaches.isPending;

  const handleClick = () =>
    evictCaches.mutate(undefined, {
      onSuccess: () =>
        toast.current?.show({
          severity: "success",
          summary: t("physicalInstance.cache.successTitle"),
          detail: t("physicalInstance.cache.successMessage"),
        }),
      onError: (err: unknown) =>
        toast.current?.show({
          severity: "error",
          summary: t("physicalInstance.cache.errorTitle"),
          detail: formatApiErrors(err, appI18n, t("physicalInstance.cache.errorMessage")).join(
            "\n",
          ),
          ...errorToastTiming(),
        }),
    });

  return (
    <>
      <Button action={handleClick} disabled={isEvicting} aria-busy={isEvicting}>
        <i className={isEvicting ? "pi pi-spin pi-spinner" : "pi pi-refresh"} aria-hidden="true" />{" "}
        <span>
          {isEvicting ? t("physicalInstance.cache.evicting") : t("physicalInstance.cache.evict")}
        </span>
      </Button>
      <DdiToast ref={toast} />
    </>
  );
};
