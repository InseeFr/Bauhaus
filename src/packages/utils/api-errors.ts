import type { i18n as I18n } from "i18next";

/**
 * Lecture des erreurs renvoyées par le back-office.
 *
 * Le SDK (`build-api`) rejette un objet nu `{ message, status }`, jamais une `Error` :
 * un `instanceof Error` ne suffit donc pas à reconnaître un échec d'appel.
 */

/**
 * Champ sentinelle du contrat de validation, pour une erreur qui porte sur le corps entier
 * plutôt que sur un champ. Doit rester aligné sur `ValidationExceptionHandler.WHOLE_BODY`
 * côté back.
 */
const WHOLE_BODY_FIELD = "body";

interface FieldError {
  field?: unknown;
  message?: unknown;
}

const isFieldError = (error: unknown): error is FieldError =>
  typeof error === "object" && error !== null && "message" in error;

const formatFieldError = ({ field, message }: FieldError) =>
  typeof field === "string" && field && field !== WHOLE_BODY_FIELD
    ? `${field} : ${String(message)}`
    : String(message);

const firstNonEmptyString = (...candidates: unknown[]): string | undefined =>
  candidates.find((candidate): candidate is string => typeof candidate === "string" && !!candidate);

const detailedErrorsOf = (err: unknown): unknown[] | null => {
  const errors = (err as { errors?: unknown })?.errors;

  return Array.isArray(errors) && errors.length > 0 ? errors : null;
};

/**
 * Message court d'un échec d'appel, pour un toast ou un bandeau.
 *
 * Les contrôleurs qui lèvent une `ResponseStatusException` répondent en
 * `application/problem+json` (RFC 7807) : le message y est porté par `detail`, pas par
 * `message`.
 */
export const getApiErrorMessage = (err: unknown, fallback: string): string =>
  getServerMessage(err) ?? fallback;

const isJsonStructure = (text: string) => {
  try {
    const parsed: unknown = JSON.parse(text);
    return typeof parsed === "object" && parsed !== null;
  } catch {
    return false;
  }
};

/**
 * Vrai pour un rejet produit par le SDK (`sdk/build-api.ts`) : un objet nu portant un `status`
 * numérique, jamais une `Error`.
 */
export const isSdkRejection = (reason: unknown): boolean =>
  typeof reason === "object" &&
  reason !== null &&
  !(reason instanceof Error) &&
  typeof (reason as { status?: unknown }).status === "number";

/** Codes des échecs que le SDK constate lui-même, sans réponse lisible du serveur. */
const SDK_ERROR_CODES: readonly unknown[] = ["NETWORK_ERROR", "UNREADABLE_RESPONSE"];

/**
 * Message porté par la réponse, s'il est affichable : ni vide, ni du JSON. `detail` est lu pour
 * les réponses `ProblemDetail`, jusqu'à leur retrait (ADR-1264, ticket 18). Le message d'un échec
 * produit par le SDK n'en est pas un : il est affiché par la traduction de son `code`.
 */
export const getServerMessage = (err: unknown): string | undefined => {
  const { message, detail, code } = (err ?? {}) as {
    message?: unknown;
    detail?: unknown;
    code?: unknown;
  };

  if (SDK_ERROR_CODES.includes(code)) return undefined;

  const text = firstNonEmptyString(message, detail);

  return text && !isJsonStructure(text) ? text : undefined;
};

const fallbackMessageKeys: Record<number, string> = {
  401: "errors.fallback.unauthorized",
  403: "errors.fallback.forbidden",
  404: "errors.fallback.notFound",
};

/** Clé de traduction du message à afficher quand la réponse n'en porte aucun d'affichable. */
export const getFallbackMessageKey = (status: unknown): string => {
  if (typeof status !== "number") return "errors.fallback.generic";

  return (
    fallbackMessageKeys[status] ??
    (status >= 500 ? "errors.fallback.server" : "errors.fallback.generic")
  );
};

/**
 * Erreurs détaillées, aplaties en lignes affichables. Le back en produit deux formes :
 * - validation d'un corps de requête : `{ errors: [{ field, message }] }` ;
 * - validation de schéma DDI4 : `{ errors: string[] }`.
 *
 * Renvoie `null` quand la réponse ne porte pas d'erreurs détaillées — c'est alors
 * {@link getApiErrorMessage} qu'il faut utiliser.
 */
export const getApiErrors = (err: unknown): string[] | null => {
  const errors = detailedErrorsOf(err);

  if (!errors) return null;

  return errors.map((error) => (isFieldError(error) ? formatFieldError(error) : String(error)));
};

/**
 * Erreurs de validation réparties pour un formulaire : celles qui portent sur un champ affiché sont
 * indexées par ce champ (à afficher à côté de la saisie), les autres restent des lignes à afficher
 * dans le bandeau.
 *
 * Renvoie `null` quand la réponse ne porte pas d'erreurs détaillées.
 */
const getApiFieldErrors = (
  err: unknown,
  displayedFields: readonly string[],
): { fields: Record<string, string>; others: string[] } | null => {
  const errors = detailedErrorsOf(err);

  if (!errors) return null;

  const fields: Record<string, string> = {};
  const others: string[] = [];

  for (const error of errors) {
    if (
      isFieldError(error) &&
      typeof error.field === "string" &&
      displayedFields.includes(error.field)
    ) {
      fields[error.field] = String(error.message);
    } else {
      others.push(isFieldError(error) ? formatFieldError(error) : String(error));
    }
  }

  return { fields, others };
};

/** Erreurs d'un formulaire, à la forme attendue par les écrans d'édition. */
export interface FormErrors {
  /** `null` quand aucune erreur ne vise un champ affiché. */
  clientSideErrors: { errorMessage: string[]; fields: Record<string, string> } | null;
  /** Ce qu'il reste à afficher dans le bandeau : le rejet entier, ou les lignes non rattachées. */
  serverSideError: unknown;
}

/**
 * Transforme le rejet d'un enregistrement en état de formulaire : les erreurs des champs affichés
 * vont sous leur saisie, le reste au bandeau. Sans erreur rattachable à un champ affiché, le rejet
 * est laissé tel quel au bandeau.
 */
export const toFormErrors = (err: unknown, displayedFields: readonly string[]): FormErrors => {
  const apiErrors = getApiFieldErrors(err, displayedFields);

  if (!apiErrors || Object.keys(apiErrors.fields).length === 0) {
    return { clientSideErrors: null, serverSideError: err };
  }

  return {
    clientSideErrors: { errorMessage: Object.values(apiErrors.fields), fields: apiErrors.fields },
    serverSideError: apiErrors.others,
  };
};

/**
 * Lignes à afficher pour un échec (ou une liste d'échecs), dans l'ordre de résolution de
 * l'ADR-1264 : erreurs détaillées, `code` traduit, `message` porteur d'une clé, message du
 * serveur, puis repli selon le statut. Une chaîne qui n'est pas du JSON est affichée telle quelle.
 */
export const formatApiErrors = (error: unknown, i18n: I18n): string[] => {
  const errors: unknown[] = Array.isArray(error) ? error : [error];

  return errors.filter((e) => !!e).flatMap((e) => formatApiError(e, i18n));
};

const formatApiError = (e: any, i18n: I18n): string | string[] => {
  const { t } = i18n;
  let parsedError;
  try {
    parsedError = e !== null && typeof e === "object" ? e : JSON.parse(e);
  } catch {
    return e;
  }

  const detailedErrors = getApiErrors(parsedError);
  if (detailedErrors) {
    return detailedErrors;
  }
  if (parsedError.code && i18n.exists(`errors.${parsedError.code}`)) {
    return String(t(`errors.${parsedError.code}`, parsedError));
  }
  if (parsedError.message && i18n.exists(`errors.${parsedError.message}`)) {
    return String(t(`errors.${parsedError.message}`, parsedError));
  }

  const serverMessage = getServerMessage(parsedError);

  if (!serverMessage) {
    return t(getFallbackMessageKey(parsedError.status));
  }
  return parsedError.status === 500
    ? t("errors.serversideErrors500", { error: serverMessage })
    : serverMessage;
};
