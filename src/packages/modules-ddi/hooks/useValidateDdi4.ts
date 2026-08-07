import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import type { RefObject } from "react";
import type { Toast } from "primereact/toast";
import { DDIApi } from "../../sdk";
import { TOAST_DURATION } from "../physical-instances/constants";
import type { PhysicalInstanceResponse } from "../physical-instances/types/api";
import { enrichDataWithCodeLists } from "../physical-instances/pages/view/enrichDataWithCodeLists";

/** Au-delà, le toast devient illisible : on renvoie vers la console pour le détail. */
const MAX_DISPLAYED_ERRORS = 10;

/**
 * Le back répond 400 + `{valid, errors}` quand le DDI4 n'est pas conforme, ce que
 * `buildCall` transforme en rejet portant le corps parsé. Un vrai échec technique
 * (500, réseau) arrive lui sous la forme `{message}` ou d'une `Error`.
 */
const extractErrors = (err: unknown): string[] | null => {
  const errors = (err as { errors?: unknown })?.errors;
  return Array.isArray(errors) && errors.length > 0 ? errors.map(String) : null;
};

const extractMessage = (err: unknown, fallback: string) => {
  if (err instanceof Error) return err.message;
  const message = (err as { message?: unknown })?.message;
  return typeof message === "string" && message ? message : fallback;
};

export const useValidateDdi4 = (data: PhysicalInstanceResponse, toast: RefObject<Toast>) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isValidating, setIsValidating] = useState(false);

  const validate = useCallback(async () => {
    setIsValidating(true);
    try {
      // Même charge utile que l'export DDI4 : les listes de codes ne sont plus
      // dans le GET, or le schéma les attend.
      const enrichedData = await enrichDataWithCodeLists(queryClient, data);
      await DDIApi.postValidateDdi4(enrichedData);

      toast.current?.show({
        severity: "success",
        summary: t("physicalInstance.view.validateDdi4Success"),
        detail: t("physicalInstance.view.validateDdi4SuccessDetail"),
        life: TOAST_DURATION,
      });
    } catch (err) {
      const errors = extractErrors(err);

      if (!errors) {
        toast.current?.show({
          severity: "error",
          summary: t("physicalInstance.view.validateDdi4Error"),
          detail: extractMessage(err, t("physicalInstance.view.validateDdi4ErrorDetail")),
          sticky: true,
        });
        return;
      }

      console.error("Validation DDI4 — erreurs de schéma :", errors);

      const displayed = errors.slice(0, MAX_DISPLAYED_ERRORS);
      const remaining = errors.length - displayed.length;
      const detail = [
        ...displayed,
        ...(remaining > 0
          ? [t("physicalInstance.view.validateDdi4MoreErrors", { count: remaining })]
          : []),
      ].join("\n");

      toast.current?.show({
        severity: "error",
        summary: t("physicalInstance.view.validateDdi4Error"),
        detail,
        sticky: true,
      });
    } finally {
      setIsValidating(false);
    }
  }, [data, t, toast, queryClient]);

  return { validate, isValidating };
};
