import { screen } from "@testing-library/react";
import { expect, vi } from "vitest";

export const typeOptions = [
  { label: "Numérique", value: "numeric" },
  { label: "Date", value: "date" },
  { label: "Texte", value: "text" },
  { label: "Code", value: "code" },
];

/** Types non numériques : chacun remplace la représentation numérique affichée par défaut. */
export const nonNumericRepresentationCases = [
  { name: "should show DateRepresentation when type is date", type: "date" },
  { name: "should show TextRepresentation when type is text", type: "text" },
  { name: "should show CodeRepresentation when type is code", type: "code" },
];

/** Valeurs du paramètre d'URL `tab` et onglet actif attendu au premier rendu. */
export const urlTabCases = [
  { name: "should restore active tab from URL on initial load", tab: "1", expectedIndex: "1" },
  { name: "should default to tab 0 for invalid tab values in URL", tab: "abc", expectedIndex: "0" },
  {
    name: "should default to tab 0 for out-of-range tab values in URL",
    tab: "99",
    expectedIndex: "0",
  },
];

/** Vérifie que seule la représentation `shown` est rendue parmi `hidden`. */
export const expectRepresentation = (shown: string, hidden: string[]) => {
  expect(screen.getByTestId(`${shown}-representation`)).toBeInTheDocument();
  hidden.forEach((type) => {
    expect(screen.queryByTestId(`${type}-representation`)).not.toBeInTheDocument();
  });
};

/**
 * État de `useSearchParams` partagé entre la spec et le module `react-router-dom` mocké :
 * `vi.mock("react-router-dom", async () => (await import("./variableForm.testing")).searchParamsRouterModule);`
 */
export const searchParamsMock = {
  current: new URLSearchParams(),
  setSearchParams: vi.fn((updater: any, _options?: any) => {
    if (typeof updater === "function") {
      searchParamsMock.current = new URLSearchParams(updater(searchParamsMock.current));
    } else if (updater instanceof URLSearchParams || typeof updater === "object") {
      searchParamsMock.current = new URLSearchParams(updater);
    }
  }),
  reset() {
    searchParamsMock.current = new URLSearchParams();
    searchParamsMock.setSearchParams.mockClear();
  },
};

export const searchParamsRouterModule = {
  useSearchParams: () => [searchParamsMock.current, searchParamsMock.setSearchParams],
};
