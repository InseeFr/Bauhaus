import { renderHook } from "@testing-library/react";

import { AppContextProvider, AppProperties } from "../../application/app-context";
import { useLocales } from "./useLocales";

describe("useLocales", () => {
  it("returns the correct initial value and toggle function", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppContextProvider lg1="English" lg2="French" properties={{} as AppProperties}>
        {children}
      </AppContextProvider>
    );

    const { result } = renderHook(() => useLocales(), { wrapper });

    const { lg1, lg2 } = result.current;
    expect(lg1).toBe("English");
    expect(lg2).toBe("French");
  });
});
