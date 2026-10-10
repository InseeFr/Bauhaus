import { vi } from "vitest";

import { CodelistsApi, fetchCodelist } from "./codelists-api";

vi.mock("../auth/create-oidc", () => ({
  getOidc: vi.fn(() => Promise.resolve(null)),
}));

const okResponse = () =>
  Promise.resolve({ ok: true, text: () => Promise.resolve(""), json: () => Promise.resolve({}) });

const expectFetchCall = async (
  method: string,
  args: unknown[],
  httpMethod: string,
  expectedUrl: string,
  extraOptions: Record<string, unknown> = {},
) => {
  using fetch = vi.spyOn(window, "fetch").mockImplementation(okResponse as never);

  await (CodelistsApi as Record<string, (...a: unknown[]) => Promise<unknown>>)[method](...args);

  expect(fetch).toHaveBeenCalledWith(
    expectedUrl,
    expect.objectContaining({ method: httpMethod, ...extraOptions }),
  );
};

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

  describe("routes des listes complètes", () => {
    it.each([
      ["getCodelists", [], "GET", "http://back/codeList"],
      ["getCodelist", ["CL_TEST"], "GET", "http://back/codeList/CL_TEST"],
      ["getDetailedCodelist", ["CL_TEST"], "GET", "http://back/codeList/detailed/CL_TEST"],
      [
        "getCodesDetailedCodelist",
        ["CL_TEST", 2],
        "GET",
        "http://back/codeList/detailed/CL_TEST/codes?page=2",
      ],
      [
        "getCodelistCodes",
        ["CL_TEST", 1, 10],
        "GET",
        "http://back/codeList/CL_TEST/codes?page=1&per_page=10",
      ],
      [
        "getCodesByCode",
        ["CL_TEST", "00"],
        "GET",
        "http://back/codeList/detailed/CL_TEST/codes?page=1&search=code:00",
      ],
      [
        "getCodesByLabel",
        ["CL_TEST", "lib"],
        "GET",
        "http://back/codeList/detailed/CL_TEST/codes?page=1&search=labelLg1:lib",
      ],
      [
        "getCodesByCodeAndLabel",
        ["CL_TEST", "00", "lib"],
        "GET",
        "http://back/codeList/detailed/CL_TEST/codes?page=1&search=code:00&search=labelLg1:lib",
      ],
      [
        "getSortedCodes",
        ["CL_TEST", "code"],
        "GET",
        "http://back/codeList/detailed/CL_TEST/codes?page=1&sort=code",
      ],
      ["getPartialsByParent", ["CL_TEST"], "GET", "http://back/codeList/partial/parent/CL_TEST"],
      ["getCodelistsForSearch", [], "GET", "http://back/codeList/search"],
      ["deleteCodelist", ["CL_TEST"], "DELETE", "http://back/codeList/CL_TEST"],
    ])("%s appelle %s", (method, args, httpMethod, expectedUrl) =>
      expectFetchCall(
        method as string,
        args as unknown[],
        httpMethod as string,
        expectedUrl as string,
      ),
    );
  });

  describe("routes des listes partielles", () => {
    it.each([
      ["getCodelistsPartial", [], "GET", "http://back/codeList/partial"],
      ["getCodelistPartial", ["CL_TEST"], "GET", "http://back/codeList/partial/CL_TEST"],
      ["getCodelistsPartialForSearch", [], "GET", "http://back/codeList/partial/search"],
      ["deleteCodelistPartial", ["CL_TEST"], "DELETE", "http://back/codeList/partial/CL_TEST"],
    ])("%s appelle %s", (method, args, httpMethod, expectedUrl) =>
      expectFetchCall(
        method as string,
        args as unknown[],
        httpMethod as string,
        expectedUrl as string,
      ),
    );
  });

  describe("envoi du corps des requêtes", () => {
    it.each([
      ["postCodelist", [{ id: "CL_TEST" }], "POST", "http://back/codeList"],
      ["putCodelist", [{ id: "CL_TEST" }], "PUT", "http://back/codeList/CL_TEST"],
      ["postCodelistPartial", [{ id: "CL_TEST" }], "POST", "http://back/codeList/partial"],
      ["putCodelistPartial", [{ id: "CL_TEST" }], "PUT", "http://back/codeList/partial/CL_TEST"],
    ])("%s sérialise la liste de codes", (method, args, httpMethod, expectedUrl) =>
      expectFetchCall(
        method as string,
        args as unknown[],
        httpMethod as string,
        expectedUrl as string,
        { body: JSON.stringify((args as unknown[])[0]) },
      ),
    );

    it.each([
      ["postCodesDetailedCodelist", "POST", "http://back/codeList/detailed/CL_TEST/codes"],
      ["putCodesDetailedCodelist", "PUT", "http://back/codeList/detailed/CL_TEST/codes/001"],
      ["deleteCodesDetailedCodelist", "DELETE", "http://back/codeList/detailed/CL_TEST/codes/001"],
    ])("%s cible le code de la liste détaillée", (method, httpMethod, expectedUrl) =>
      expectFetchCall(
        method,
        ["CL_TEST", { code: "001", labelLg1: "Premier" }],
        httpMethod,
        expectedUrl,
      ),
    );
  });

  describe("fetchCodelist", () => {
    it("assemble la liste et ses codes en un seul objet", async () => {
      using _fetch = vi.spyOn(window, "fetch").mockImplementation(((url: string) =>
        Promise.resolve({
          ok: true,
          text: () => Promise.resolve(""),
          json: () =>
            Promise.resolve(
              url.includes("/codes")
                ? { items: [{ code: "001" }] }
                : { id: "CL_TEST", labelLg1: "Ma liste" },
            ),
        })) as never);

      const codeList = await fetchCodelist("CL_TEST");

      expect(codeList).toEqual({
        id: "CL_TEST",
        labelLg1: "Ma liste",
        codes: [{ code: "001" }],
      });
    });

    it("renvoie une liste de codes vide quand le back n'en fournit pas", async () => {
      using _fetch = vi.spyOn(window, "fetch").mockImplementation(okResponse as never);

      const codeList = await fetchCodelist("CL_TEST");

      expect(codeList.codes).toEqual([]);
    });
  });
});
