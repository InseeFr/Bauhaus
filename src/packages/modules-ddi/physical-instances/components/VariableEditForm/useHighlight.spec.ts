import { configure, renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { useHighlight } from "./useHighlight";

// Le hook charge highlight.js par import dynamique. À froid, la transformation du chunk
// par Vite dépasse la seconde par défaut de `waitFor` quand les 414 fichiers de spec
// tournent en parallèle — et `vi.resetModules()` d'un des tests refroidit à nouveau
// l'import pour les suivants.
const DEFAULT_ASYNC_UTIL_TIMEOUT = 1000;
beforeAll(() => configure({ asyncUtilTimeout: 15000 }));
afterAll(() => configure({ asyncUtilTimeout: DEFAULT_ASYNC_UTIL_TIMEOUT }));

describe("useHighlight", () => {
  it("should return null initially", () => {
    const { result } = renderHook(() => useHighlight("<root/>", "xml"));
    expect(result.current).toBeNull();
  });

  it("should return highlighted HTML for xml", async () => {
    const { result } = renderHook(() => useHighlight("<root/>", "xml"));

    await waitFor(() => {
      expect(result.current).not.toBeNull();
    });

    expect(result.current).toContain("hljs");
  });

  it("should return highlighted HTML for json", async () => {
    const { result } = renderHook(() => useHighlight('{"key":"value"}', "json"));

    await waitFor(() => {
      expect(result.current).not.toBeNull();
    });

    expect(result.current).toContain("hljs");
  });

  it("should update when code changes", async () => {
    const { result, rerender } = renderHook(({ code, lang }) => useHighlight(code, lang), {
      initialProps: { code: "<a/>", lang: "xml" as const },
    });

    await waitFor(() => {
      expect(result.current).not.toBeNull();
    });

    const firstResult = result.current;

    rerender({ code: "<different-tag/>", lang: "xml" as const });

    await waitFor(() => {
      expect(result.current).not.toBe(firstResult);
    });

    expect(result.current).toContain("different-tag");
  });

  it("should degrade to no highlighting when the highlight chunk fails to load", async () => {
    vi.resetModules();
    vi.doMock("highlight.js/lib/core", () => {
      throw new Error("Failed to fetch dynamically imported module");
    });
    using warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const { useHighlight: useHighlightWithBrokenChunk } = await import("./useHighlight");
    const { result } = renderHook(() => useHighlightWithBrokenChunk("<root/>", "xml"));

    await waitFor(() => {
      expect(warn).toHaveBeenCalled();
    });
    expect(result.current).toBeNull();

    vi.doUnmock("highlight.js/lib/core");
    vi.resetModules();
  });

  it("should update when language changes", async () => {
    const { result, rerender } = renderHook(({ code, lang }) => useHighlight(code, lang), {
      // Le test change de langage en cours de route : le type doit couvrir les deux.
      initialProps: { code: '{"a":1}', lang: "json" as "json" | "xml" },
    });

    await waitFor(() => {
      expect(result.current).not.toBeNull();
    });

    const jsonResult = result.current;

    rerender({ code: '{"a":1}', lang: "xml" as const });

    await waitFor(() => {
      expect(result.current).not.toBe(jsonResult);
    });
  });
});
