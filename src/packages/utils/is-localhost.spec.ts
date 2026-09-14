import { describe, it, expect, afterEach, vi } from "vitest";

import { isLocalhost } from "./is-localhost";

describe("isLocalhost", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each(["localhost", "127.0.0.1", "[::1]"])(
    "retourne true quand le front est servi depuis %s",
    (hostname) => {
      vi.stubGlobal("location", { hostname });

      expect(isLocalhost()).toBe(true);
    },
  );

  it.each(["bauhaus.insee.fr", "bauhaus-dev.insee.fr", "notlocalhost.fr"])(
    "retourne false quand le front est servi depuis %s",
    (hostname) => {
      vi.stubGlobal("location", { hostname });

      expect(isLocalhost()).toBe(false);
    },
  );
});
