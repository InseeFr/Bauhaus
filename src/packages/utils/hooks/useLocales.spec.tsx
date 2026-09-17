import { renderHook } from "@testing-library/react";

import { useLocales } from "./useLocales";
import { englishFrenchAppContextWrapper as wrapper } from "./wrappers.testing";

describe("useLocales", () => {
  it("returns the correct initial value and toggle function", () => {
    const { result } = renderHook(() => useLocales(), { wrapper });

    const { lg1, lg2 } = result.current;
    expect(lg1).toBe("English");
    expect(lg2).toBe("French");
  });
});
