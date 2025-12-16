import { renderHook, act } from "@testing-library/react";

import { AppContextProvider, AppProperties } from "../../application/app-context";
import { useSecondLang } from "./second-lang";

describe("useSecondLang", () => {
  it("returns the correct initial value and toggle function", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppContextProvider lg1="English" lg2="French" properties={{} as AppProperties}>
        {children}
      </AppContextProvider>
    );

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
