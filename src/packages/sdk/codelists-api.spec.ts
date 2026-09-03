import { vi } from "vitest";

import { CodelistsApi } from "./codelists-api";

vi.mock("../auth/create-oidc", () => ({
  getOidc: vi.fn(() => Promise.resolve(null)),
}));

const okResponse = () =>
  Promise.resolve({ ok: true, text: () => Promise.resolve(""), json: () => Promise.resolve({}) });

describe("codelists api", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_API_BASE_HOST", "http://back");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("publishes a codelist on the id/validate route exposed by the back", async () => {
    using fetch = vi.spyOn(window, "fetch").mockImplementation(okResponse as never);

    await CodelistsApi.publishCodelist("CL_TEST");

    expect(fetch).toHaveBeenCalledWith(
      "http://back/codeList/CL_TEST/validate",
      expect.objectContaining({ method: "PUT" }),
    );
  });

  it("publishes a partial codelist on the id/validate route exposed by the back", async () => {
    using fetch = vi.spyOn(window, "fetch").mockImplementation(okResponse as never);

    await CodelistsApi.publishPartialCodelist("CL_TEST");

    expect(fetch).toHaveBeenCalledWith(
      "http://back/codeList/partial/CL_TEST/validate",
      expect.objectContaining({ method: "PUT" }),
    );
  });
});
