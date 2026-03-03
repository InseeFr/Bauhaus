import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useHighlight } from "./useHighlight";

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

  it("should update when language changes", async () => {
    const { result, rerender } = renderHook(({ code, lang }) => useHighlight(code, lang), {
      initialProps: { code: '{"a":1}', lang: "json" as const },
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
