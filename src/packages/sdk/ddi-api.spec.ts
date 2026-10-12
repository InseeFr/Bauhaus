import { vi } from "vitest";

import { DDIApi } from "./ddi-api";

vi.mock("../auth/create-oidc", () => ({
  getOidc: vi.fn(() => Promise.resolve(null)),
}));

describe("ddi api", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_API_BASE_HOST", "http://back");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("résout le PUT d'une instance physique sur la réponse 204 sans corps du back", async () => {
    using fetch = vi.spyOn(window, "fetch").mockResolvedValue(new Response(null, { status: 204 }));

    await expect(DDIApi.putPhysicalInstance("fr.insee", "pi-1", {})).resolves.toBeUndefined();

    expect(fetch).toHaveBeenCalledWith(
      "http://back/ddi/physical-instance/fr.insee/pi-1",
      expect.objectContaining({ method: "PUT" }),
    );
  });

  it("vide les caches Colectica par un DELETE et résout sur la réponse 204 sans corps", async () => {
    using fetch = vi.spyOn(window, "fetch").mockResolvedValue(new Response(null, { status: 204 }));

    await expect(DDIApi.evictCaches()).resolves.toBeUndefined();

    expect(fetch).toHaveBeenCalledWith(
      "http://back/ddi/cache",
      expect.objectContaining({ method: "DELETE" }),
    );
  });
});
