import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDefaultLocale } from "./useDefaultLocale";
import * as appContext from "../../application/app-context";

vi.mock("../../application/app-context");

describe("useDefaultLocale", () => {
  it("should return the first locale from colecticaLangs array", () => {
    vi.mocked(appContext.useAppContext).mockReturnValue({
      properties: {
        colecticaLangs: ["en-GB", "fr-FR"],
        modules: [],
        activeModules: [],
        defaultContributor: "",
        maxLengthScopeNote: "",
        extraMandatoryFields: "",
        defaultAgencyId: "",
      },
      lg1: "fr",
      lg2: "en",
      secondLang: { value: false, toggle: vi.fn() },
    });

    const { result } = renderHook(() => useDefaultLocale());

    expect(result.current).toBe("en-GB");
  });

  it("should return fr-FR as fallback when colecticaLangs is undefined", () => {
    vi.mocked(appContext.useAppContext).mockReturnValue({
      properties: {
        modules: [],
        activeModules: [],
        defaultContributor: "",
        maxLengthScopeNote: "",
        extraMandatoryFields: "",
        defaultAgencyId: "",
      },
      lg1: "fr",
      lg2: "en",
      secondLang: { value: false, toggle: vi.fn() },
    });

    const { result } = renderHook(() => useDefaultLocale());

    expect(result.current).toBe("fr-FR");
  });

  it("should return fr-FR as fallback when colecticaLangs is empty array", () => {
    vi.mocked(appContext.useAppContext).mockReturnValue({
      properties: {
        colecticaLangs: [],
        modules: [],
        activeModules: [],
        defaultContributor: "",
        maxLengthScopeNote: "",
        extraMandatoryFields: "",
        defaultAgencyId: "",
      },
      lg1: "fr",
      lg2: "en",
      secondLang: { value: false, toggle: vi.fn() },
    });

    const { result } = renderHook(() => useDefaultLocale());

    expect(result.current).toBe("fr-FR");
  });

  it("should return first locale even with multiple values", () => {
    vi.mocked(appContext.useAppContext).mockReturnValue({
      properties: {
        colecticaLangs: ["de-DE", "es-ES", "it-IT"],
        modules: [],
        activeModules: [],
        defaultContributor: "",
        maxLengthScopeNote: "",
        extraMandatoryFields: "",
        defaultAgencyId: "",
      },
      lg1: "fr",
      lg2: "en",
      secondLang: { value: false, toggle: vi.fn() },
    });

    const { result } = renderHook(() => useDefaultLocale());

    expect(result.current).toBe("de-DE");
  });
});
