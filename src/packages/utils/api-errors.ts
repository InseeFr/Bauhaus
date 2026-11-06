import type { i18n as I18n } from "i18next";

/**
 * Lecture des erreurs renvoyées par le back-office, au format unique de l'ADR-1264 :
 * `{ message, code?, params?, errors?: [{ field, message }] }`.
 *
 * Le SDK (`build-api`) rejette ce corps complété du `status`, jamais une `Error` : un
 * `instanceof Error` ne suffit donc pas à reconnaître un échec d'appel. Un échec constaté par le
 * SDK lui-même (réseau, réponse illisible) prend la même forme, avec un `code` du SDK.
 *
 * {@link formatApiErrors} est le seul lecteur : tout écran qui affiche un échec passe par lui
 * (directement, ou via `ErrorBloc` et le toast global).
 */

/**
 * Champ sentinelle du contrat de validation, pour une erreur qui porte sur le corps entier
 * plutôt que sur un champ. Doit rester aligné sur `ApiError.FieldError.WHOLE_BODY` côté
 * back.
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

const detailedErrorsOf = (err: unknown): unknown[] | null => {
  const errors = (err as { errors?: unknown })?.errors;

  return Array.isArray(errors) && errors.length > 0 ? errors : null;
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

/** Vrai pour une réponse 404 : l'élément demandé n'existe pas. */
export const isNotFound = (error: unknown): boolean =>
  typeof error === "object" && error !== null && (error as { status?: unknown }).status === 404;

/** Message du corps, s'il est affichable. */
const messageOf = (err: unknown): string | undefined => {
  const message = (err as { message?: unknown } | null)?.message;

  return typeof message === "string" && message ? message : undefined;
};

const fallbackMessageKeys: Record<number, string> = {
  401: "errors.fallback.unauthorized",
  403: "errors.fallback.forbidden",
  404: "errors.fallback.notFound",
};

/** Clé de traduction du message à afficher quand la réponse n'en porte aucun d'affichable. */
const fallbackMessageKeyOf = (status: unknown): string => {
  if (typeof status !== "number") return "errors.fallback.generic";

  return (
    fallbackMessageKeys[status] ??
    (status >= 500 ? "errors.fallback.server" : "errors.fallback.generic")
  );
};

/**
 * Erreurs détaillées `{ errors: [{ field, message }] }` (validation d'un corps de requête ou
 * schéma DDI4), aplaties en lignes affichables.
 *
 * Renvoie `null` quand la réponse ne porte pas d'erreurs détaillées — c'est alors
 * {@link formatApiErrors} qu'il faut utiliser.
 */
export const getApiErrors = (err: unknown): string[] | null => {
  const errors = detailedErrorsOf(err);

  if (!errors) return null;

  return errors.filter(isFieldError).map(formatFieldError);
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

  for (const error of errors.filter(isFieldError)) {
    if (typeof error.field === "string" && displayedFields.includes(error.field)) {
      fields[error.field] = String(error.message);
    } else {
      others.push(formatFieldError(error));
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
 * l'ADR-1264 :
 * 1. erreurs détaillées (`errors`), une ligne chacune ;
 * 2. `code` traduit dans le catalogue global (`errors.<code>`), avec `params` ;
 * 3. `message` du corps (anglais côté back : repli quand le code n'est pas traduit) ;
 * 4. repli de l'écran (`fallback`) s'il en donne un, sinon repli selon le statut.
 *
 * Une chaîne est une ligne déjà rédigée par l'écran : elle est affichée telle quelle.
 */
export const formatApiErrors = (error: unknown, i18n: I18n, fallback?: string): string[] => {
  const errors: unknown[] = Array.isArray(error) ? error : [error];

  return errors.filter((e) => !!e).flatMap((e) => formatApiError(e, i18n, fallback));
};

const formatApiError = (error: unknown, i18n: I18n, fallback?: string): string | string[] => {
  if (typeof error === "string") return error;

  const detailedErrors = getApiErrors(error);
  if (detailedErrors) return detailedErrors;

  const { code, params, status } = error as {
    code?: unknown;
    params?: Record<string, string>;
    status?: unknown;
  };
  const codeKey = `errors.${String(code)}`;
  if (typeof code === "string" && code && i18n.exists(codeKey)) {
    return String(i18n.t(codeKey, params));
  }

  const message = messageOf(error);
  if (!message) return fallback ?? i18n.t(fallbackMessageKeyOf(status));

  return status === 500 ? i18n.t("errors.serversideErrors500", { error: message }) : message;
};
