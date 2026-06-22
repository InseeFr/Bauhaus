import { vi } from "vitest";

import { buildCall } from "../build-api";
import simsApi from "./sims";
import type { Sims } from "../../model/Sims";

vi.mock("../../auth/create-oidc", () => ({
  getOidc: vi.fn(() => Promise.resolve(null)),
}));

describe("deleteSims", () => {
  it("resolves when the backend returns 204 with an empty body", () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 204,
        text: () => Promise.resolve(""),
        json: () => Promise.reject(new SyntaxError("Unexpected end of JSON input")),
      }),
    );
    window.fetch = fetchMock as any;

    const remoteCall = buildCall("operations", "deleteSims", simsApi.deleteSims);
    return expect(remoteCall({ id: "42" } as Sims)).resolves.not.toThrow();
  });

  it("issues a DELETE request and does not send a JSON body", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 204,
        text: () => Promise.resolve(""),
        json: () => Promise.reject(new SyntaxError("Unexpected end of JSON input")),
      }),
    );
    window.fetch = fetchMock as any;

    const remoteCall = buildCall("operations", "deleteSims", simsApi.deleteSims);
    await remoteCall({ id: "42" } as Sims);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, options] = fetchMock.mock.calls[0] as any;
    expect(options.method).toBe("DELETE");
    expect(options.body).toBeUndefined();
  });
});
