import { Toast } from "primereact/toast";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { appI18n } from "../../i18n";
import { formatApiErrors, isSdkRejection } from "../../utils/api-errors";
import { sanitizeHtml } from "../../utils/sanitize-html";
import { notifyGlobalError, subscribeToGlobalErrors } from "./notifier";

/**
 * Filet de l'application : affiche en toast les échecs qu'aucun écran n'a affichés — mutations
 * non traitées (voir `createQueryClient`) et appels à l'API rejetés sans `catch`. Les autres
 * rejets non rattrapés (bugs du front) restent dans la console.
 */
export const GlobalErrorToast = () => {
  const toast = useRef<Toast>(null);
  const { t } = useTranslation("translation", { i18n: appI18n });

  useEffect(
    () =>
      subscribeToGlobalErrors((error) => {
        toast.current?.show(
          formatApiErrors(error, appI18n).map((message) => ({
            severity: "error",
            summary: t("errors.toastSummary"),
            detail: <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(message) }} />,
            life: 10000,
          })),
        );
      }),
    [t],
  );

  useEffect(() => {
    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (isSdkRejection(event.reason)) notifyGlobalError(event.reason);
    };

    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => window.removeEventListener("unhandledrejection", onUnhandledRejection);
  }, []);

  return <Toast ref={toast} />;
};
