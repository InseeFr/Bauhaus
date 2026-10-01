import { vi } from "vitest";

import { appI18n } from "../i18n";
import {
  buildApi,
  computeDscr,
  guessMethod,
  buildCall,
  getBaseURI,
  generateGenericApiEndpoints,
} from "./build-api";

vi.mock("../auth/create-oidc", () => ({
  getOidc: vi.fn(() => Promise.resolve(null)),
}));

describe("get base URI", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns the configured API base host", () => {
    vi.stubEnv("VITE_API_BASE_HOST", "http://first-host");
    expect(getBaseURI()).toEqual("http://first-host");
  });

  it("reflects the current configuration instead of a previously read value", () => {
    vi.stubEnv("VITE_API_BASE_HOST", "http://first-host");
    getBaseURI();

    vi.stubEnv("VITE_API_BASE_HOST", "http://second-host");
    expect(getBaseURI()).toEqual("http://second-host");
  });
});

describe("generate generic api endpoints", () => {
  // Les entrées générées n'ont pas toutes la même signature (`getXById` prend un identifiant),
  // d'où le typage explicite de celles qui s'appellent sans argument.
  const callWithoutArgument = (endpoint: unknown) => (endpoint as () => string[])();

  it("exposes an advanced search endpoint by default", () => {
    const endpoints = generateGenericApiEndpoints("families", "family");

    expect(callWithoutArgument(endpoints.getAllFamiliesForAdvancedSearch)).toEqual([
      "families/advanced-search",
    ]);
  });

  it("omits the advanced search endpoint for an entity which does not expose one", () => {
    const endpoints = generateGenericApiEndpoints("indicators", "indicator", {
      advancedSearch: false,
    });

    expect(endpoints).not.toHaveProperty("getAllIndicatorsForAdvancedSearch");
    expect(callWithoutArgument(endpoints.getAllIndicators)).toEqual(["indicators"]);
  });
});

describe("guess method from end point", () => {
  it("should return GET", () => {
    expect(guessMethod("getSomething")).toEqual("GET");
  });
  it("...or PUT", () => {
    expect(guessMethod("putSomething")).toEqual("PUT");
  });
  it("...or POST", () => {
    expect(guessMethod("postSomething")).toEqual("POST");
  });
  it("...and throw otherwise", () => {
    expect(() => guessMethod("invalidSomething")).toThrow();
  });
});

const handler = (res: Response) => res.text().then((id) => id);
const postCommentFn = (username: string, info: unknown) => [
  `comment/${username}`,
  {
    method: "POST",
    body: info,
  },
  handler,
];

describe("compute api call description", () => {
  it("should fetch an url with some options and chain the given then handler", async () => {
    global.fetch = vi.fn();
    const [url, options, thenHandler] = await computeDscr(postCommentFn, ["john", "some raw text"]);
    expect(url).toEqual("comment/john");
    expect(options).toMatchObject({ method: "POST", body: "some raw text" });
    expect(thenHandler).toEqual(handler);
  });
});

describe("build call", () => {
  it("returns a function which calls fetch with the computed body and chains it with the given handler", () => {
    const resPromise = () => Promise.resolve(42);
    const fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        text: resPromise,
      }),
    );
    window.fetch = fetch as any;
    const remoteCall = buildCall("context", "postComment", postCommentFn);
    expect.assertions(1);
    return expect(remoteCall("john", "some text")).resolves.toEqual(42);
  });
  const errorBodies = [
    { name: "returns an error with a JSONObject value as string", body: "error" },
    { name: "returns an error with a JSONObject value as object", body: '{ "message": "error" }' },
  ];

  errorBodies.forEach(({ name, body }) =>
    it(name, () => {
      const fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          text: () => Promise.resolve(body),
        }),
      );
      window.fetch = fetch as any;
      const remoteCall = buildCall("context", "postComment", postCommentFn);
      expect.assertions(1);
      return expect(remoteCall("john", "some text")).rejects.toEqual({
        message: "error",
        status: 500,
      });
    }),
  );

  it("rejects the status alone, with an empty message, when the error has no body", async () => {
    window.fetch = vi.fn(() => Promise.resolve(new Response("", { status: 401 }))) as any;

    await expect(buildCall("context", "getSomething", () => ["something"])()).rejects.toEqual({
      message: "",
      status: 401,
    });
  });

  it("rejects the error body of the API (ADR-1264) with its status", async () => {
    const body = {
      message: "The submitted data is invalid",
      code: "INVALID_REQUEST_BODY",
      params: { id: "s1001" },
      errors: [{ field: "prefLabelLg1", message: "Ce champ est obligatoire." }],
    };
    window.fetch = vi.fn(() =>
      Promise.resolve(new Response(JSON.stringify(body), { status: 400 })),
    ) as any;

    await expect(buildCall("context", "postSomething", () => ["something"])()).rejects.toEqual({
      ...body,
      status: 400,
    });
  });

  it("rejects an object, not a string, when the server cannot be reached", async () => {
    const cause = new TypeError("Failed to fetch");
    window.fetch = vi.fn(() => Promise.reject(cause)) as any;

    await expect(buildCall("context", "getSomething", () => ["something"])()).rejects.toEqual({
      status: 0,
      code: "NETWORK_ERROR",
      message: "The server cannot be reached. Check your connection and try again.",
      cause,
    });
  });

  it("writes the network failure message in the current language", async () => {
    await appI18n.changeLanguage("fr");
    window.fetch = vi.fn(() => Promise.reject(new TypeError("Failed to fetch"))) as any;

    await expect(buildCall("context", "getSomething", () => ["something"])()).rejects.toMatchObject(
      {
        message: "Le serveur est injoignable. Vérifiez votre connexion et réessayez.",
      },
    );

    await appI18n.changeLanguage("en");
  });

  it("rejects an object when a successful response cannot be read", async () => {
    window.fetch = vi.fn(() => Promise.resolve(new Response("", { status: 200 }))) as any;

    await expect(buildCall("context", "getSomething", () => ["something"])()).rejects.toEqual({
      status: 200,
      code: "UNREADABLE_RESPONSE",
      message: "The server response could not be read.",
      cause: expect.any(SyntaxError),
    });
  });
});

describe("build api", () => {
  it("takes an object and returns an object with the same properties", () => {
    expect(buildApi("http://localhost:8080", { getSomething: vi.fn() })).toHaveProperty(
      "getSomething",
    );
  });
  buildApi("http://localhost:8080", { getSomething: () => ["people"] });
});
