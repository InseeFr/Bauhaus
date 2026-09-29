import { vi } from "vitest";

import { buildCall } from "../sdk/build-api";
import { sdkRejection } from "./sdk-rejection.testing";

vi.mock("../auth/create-oidc", () => ({
  getOidc: vi.fn(() => Promise.resolve(null)),
}));

const getSomething = () => ["something"];

/** Ce que le vrai SDK rejette quand `fetch` produit `outcome`. */
const rejectionOf = async (outcome: () => Promise<Response>) => {
  window.fetch = vi.fn(outcome) as any;

  return buildCall("context", "getSomething", getSomething)().then(
    () => {
      throw new Error("l'appel aurait dû être rejeté");
    },
    (rejection: unknown) => rejection,
  );
};

const respond = (status: number, body: string) => () =>
  Promise.resolve(new Response(body, { status }));

describe("sdkRejection reproduit exactement les rejets de buildCall", () => {
  it("erreur HTTP à corps JSON : les champs du corps plus le statut", async () => {
    const body = { message: "Série introuvable", code: "SERIES_NOT_FOUND" };

    expect(await rejectionOf(respond(404, JSON.stringify(body)))).toEqual(
      sdkRejection.json(404, body),
    );
  });

  it("erreur HTTP à corps texte : le texte dans message", async () => {
    expect(await rejectionOf(respond(500, "Something went wrong"))).toEqual(
      sdkRejection.text(500, "Something went wrong"),
    );
  });

  it("erreur HTTP à corps vide : message vide", async () => {
    const rejection = await rejectionOf(respond(401, ""));

    expect(rejection).toEqual(sdkRejection.emptyBody(401));
    expect(rejection).toEqual({ message: "", status: 401 });
  });

  it("ProblemDetail de Spring : detail, sans message", async () => {
    const body = JSON.stringify({
      type: "about:blank",
      title: "Forbidden",
      status: 403,
      detail: "Accès refusé",
      instance: "/operations/series/s1",
    });

    const rejection = await rejectionOf(respond(403, body));

    expect(rejection).toEqual(
      sdkRejection.problemDetail(403, "Accès refusé", { instance: "/operations/series/s1" }),
    );
    expect(rejection).not.toHaveProperty("message");
  });

  it("erreur réseau : un objet NETWORK_ERROR de statut 0", async () => {
    const rejection = await rejectionOf(() => Promise.reject(new TypeError("Failed to fetch")));

    expect(rejection).toEqual(sdkRejection.network());
    expect(rejection).toMatchObject({ status: 0, code: "NETWORK_ERROR" });
  });

  it("réponse 2xx illisible : un objet UNREADABLE_RESPONSE avec le statut", async () => {
    const rejection = await rejectionOf(respond(200, ""));

    expect(rejection).toEqual(sdkRejection.unreadableResponse(200));
  });
});
