import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";

import { AppContextProvider, AppProperties, useAppContext } from "./app-context";

const TestComponent = () => {
  const { lg1, lg2, secondLang } = useAppContext();
  return (
    <div>
      <p data-testid="lg1">{lg1}</p>
      <p data-testid="lg2">{lg2}</p>
      <p data-testid="secondLangValue">{secondLang.value ? "true" : "false"}</p>
      <button type="button" onClick={secondLang.toggle} data-testid="toggleButton">
        Toggle Second Language
      </button>
    </div>
  );
};

describe("AppContext", () => {
  it("provides the correct context values", () => {
    render(
      <AppContextProvider lg1="English" lg2="French" properties={{} as AppProperties}>
        <TestComponent />
      </AppContextProvider>,
    );

    expect(screen.getByTestId("lg1").textContent).toBe("English");
    expect(screen.getByTestId("lg2").textContent).toBe("French");
    expect(screen.getByTestId("secondLangValue").textContent).toBe("false");

    fireEvent.click(screen.getByTestId("toggleButton"));

    expect(screen.getByTestId("secondLangValue").textContent).toBe("true");
  });

  it("throws an error if context is used outside provider", () => {
    const originalError = console.error;
    console.error = vi.fn();

    expect(() => render(<TestComponent />)).toThrow(
      "The context AppContextTypes is not available.",
    );

    console.error = originalError;
  });
});
