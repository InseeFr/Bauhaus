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

/**
 * Message court d'un échec d'appel, pour un toast ou un bandeau.
 *
 * Les contrôleurs qui lèvent une `ResponseStatusException` répondent en
 * `application/problem+json` (RFC 7807) : le message y est porté par `detail`, pas par
 * `message`.
 */
export const getApiErrorMessage = (err: unknown, fallback: string): string => {
  if (err instanceof Error) return err.message || fallback;
  const { message, detail } = (err ?? {}) as { message?: unknown; detail?: unknown };
  return firstNonEmptyString(message, detail) ?? fallback;
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
  const errors = (err as { errors?: unknown })?.errors;
  if (!Array.isArray(errors) || errors.length === 0) return null;

  return errors.map((error) => (isFieldError(error) ? formatFieldError(error) : String(error)));
};
