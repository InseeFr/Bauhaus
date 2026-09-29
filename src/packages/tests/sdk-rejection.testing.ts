/**
 * Rejets tels que le SDK (`sdk/build-api.ts`, `buildCall`) les produit réellement, pour simuler
 * une erreur d'API dans un test : `vi.mocked(Api.getX).mockRejectedValue(sdkRejection.text(500, "…"))`.
 *
 * Le SDK ne rejette **jamais** une instance d'`Error` :
 * - réponse HTTP en erreur : un objet nu, le corps JSON étalé plus `status`, ou, si le corps n'est
 *   pas du JSON, `{ message: <texte brut>, status }` — y compris le corps vide (`message: ""`) ;
 * - `ProblemDetail` de Spring : `{ type, title, status, detail, instance }`, donc **sans** `message` ;
 * - panne réseau : `{ status: 0, code: "NETWORK_ERROR", message, cause }` ;
 * - réponse 2xx illisible (`res.json()` sur un corps vide) :
 *   `{ status, code: "UNREADABLE_RESPONSE", message, cause }`.
 *
 * `message` est traduit dans la langue courante ; `cause` garde l'exception d'origine, pour la
 * console seulement (ADR-1264, point 4).
 *
 * Un test qui rejette `new Error("500")` ou une chaîne JSON reste vert alors que l'écran ne sait
 * pas afficher le vrai rejet. La conformité de chaque fabrique à `buildCall` est vérifiée par
 * `sdk-rejection.spec.ts`.
 */

import { appI18n } from "../i18n";

const reasonPhrases: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
  500: "Internal Server Error",
};

export const sdkRejection = {
  /** Réponse en erreur dont le corps est un objet JSON (ex. `{ message, code }`, `{ errors }`). */
  json: (status: number, body: Record<string, unknown>) => ({ ...body, status }),

  /** Réponse en erreur dont le corps n'est pas du JSON : le texte brut devient `message`. */
  text: (status: number, text: string) => ({ message: text, status }),

  /** Réponse en erreur sans corps (ex. 401 renvoyé par Spring Security). */
  emptyBody: (status: number) => ({ message: "", status }),

  /** `ProblemDetail` de Spring (RFC 9457) : le message est dans `detail`, pas de `message`. */
  problemDetail: (
    status: number,
    detail: string,
    { title = reasonPhrases[status] ?? "Error", instance = "/" } = {},
  ) => ({ type: "about:blank", title, status, detail, instance }),

  /** Panne réseau, serveur injoignable ou CORS : `fetch` rejette. */
  network: () => ({
    status: 0,
    code: "NETWORK_ERROR",
    message: appI18n.t("errors.NETWORK_ERROR"),
    cause: new TypeError("Failed to fetch"),
  }),

  /** Réponse 2xx dont le corps ne peut pas être lu (ex. `res.json()` sur un corps vide). */
  unreadableResponse: (status: number) => ({
    status,
    code: "UNREADABLE_RESPONSE",
    message: appI18n.t("errors.UNREADABLE_RESPONSE"),
    cause: new SyntaxError("Unexpected end of JSON input"),
  }),
};
