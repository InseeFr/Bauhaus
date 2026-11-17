import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import * as appContext from "../../application/app-context";
import { useDefaultLocale } from "./useDefaultLocale";

vi.mock("../../application/app-context");

const givenColecticaLangs = (colecticaLangs?: string[]) => {
  vi.mocked(appContext.useAppContext).mockReturnValue({
    properties: {
      ...(colecticaLangs ? { colecticaLangs } : {}),
      modules: [],
      defaultContributor: "",
      maxLengthScopeNote: "",
      extraMandatoryFields: "",
      defaultAgencyId: "",
    },
    lg1: "fr",
    lg2: "en",
    secondLang: { value: false, toggle: vi.fn() },
  });
};

const cases = [
  {
    name: "should return the first locale from colecticaLangs array",
    colecticaLangs: ["en-GB", "fr-FR"] as string[] | undefined,
    expected: "en-GB",
  },
  {
    name: "should return fr-FR as fallback when colecticaLangs is undefined",
    colecticaLangs: undefined,
    expected: "fr-FR",
  },
  {
    name: "should return fr-FR as fallback when colecticaLangs is empty array",
    colecticaLangs: [],
    expected: "fr-FR",
  },
  {
    name: "should return first locale even with multiple values",
    colecticaLangs: ["de-DE", "es-ES", "it-IT"],
    expected: "de-DE",
  },
];

describe("useDefaultLocale", () => {
  cases.forEach(({ name, colecticaLangs, expected }) =>
    it(name, () => {
      givenColecticaLangs(colecticaLangs);

      const { result } = renderHook(() => useDefaultLocale());

      expect(result.current).toBe(expected);
    }),
  );
});
