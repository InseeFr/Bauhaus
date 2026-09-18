import { renderHook, act } from "@testing-library/react";

import { useSecondLang } from "./second-lang";
import { englishFrenchAppContextWrapper as wrapper } from "./wrappers.testing";

describe("useSecondLang", () => {
  it("returns the correct initial value and toggle function", () => {
    const { result } = renderHook(() => useSecondLang(), { wrapper });

    const [value, toggle] = result.current;
    expect(value).toBe(false);

    act(() => {
      toggle();
    });

    const [newValue] = result.current;
    expect(newValue).toBe(true);
  });
});
