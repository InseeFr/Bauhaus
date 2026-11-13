import { screen } from "@testing-library/react";
import { vi } from "vitest";

const startAppWithInitResponse = async (response: Response) => {
  vi.resetModules();
  document.body.innerHTML = '<div id="root"></div>';
  window.fetch = vi.fn(() => Promise.resolve(response)) as unknown as typeof fetch;
  await import("./index");
};

describe("application startup", () => {
  it.each([502, 503, 401])("shows the error page when /init answers %s", async (status) => {
    await startAppWithInitResponse(new Response("Bad Gateway", { status }));

    expect(await screen.findByRole("heading", { name: /erreur|error/i })).toBeDefined();
  });

  it("shows the error page when /init answers a body which is not JSON", async () => {
    await startAppWithInitResponse(new Response("<html>Login</html>", { status: 200 }));

    expect(await screen.findByRole("heading", { name: /erreur|error/i })).toBeDefined();
  });
});
