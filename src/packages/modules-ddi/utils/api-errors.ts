import type { TFunction } from "i18next";

import { getApiErrorMessage } from "@utils/api-errors";

interface CodedApiError {
  code: string;
  params?: Record<string, string>;
}

const isCodedApiError = (err: unknown): err is CodedApiError =>
  typeof err === "object" && err !== null && typeof (err as { code?: unknown }).code === "string";

/**
 * Message d'un échec d'appel à l'API DDI, dans la langue de l'utilisateur.
 *
 * Le back accompagne certaines erreurs d'un `code` stable et de ses `params` (ex. 409
 * `MissingSchemeException`) : il est traduit via `physicalInstance.errors.<code>`. Sans code, ou
 * pour un code sans traduction, on garde le message du back — puis le repli.
 */
export const getDdiErrorMessage = (err: unknown, t: TFunction, fallback: string): string => {
  const backMessage = getApiErrorMessage(err, fallback);
  if (!isCodedApiError(err)) return backMessage;

  return t(`physicalInstance.errors.${err.code}`, {
    ...err.params,
    defaultValue: backMessage,
  });
};
