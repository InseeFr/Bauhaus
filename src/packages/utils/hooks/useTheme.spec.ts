import { renderHook } from "@testing-library/react";

import { useTheme } from "./useTheme";

describe("useTheme", () => {
  afterEach(() => {
    document.body.removeAttribute("class");
  });

  it("applies the module theme on the body so that overlays rendered outside #root-app inherit it", () => {
    renderHook(() => useTheme("codelists"));

    expect(document.body).toHaveClass("codelists");
  });

  it("replaces the previous module theme without removing the other body classes", () => {
    document.body.classList.add("structures", "p-overflow-hidden");

    renderHook(() => useTheme("codelists"));

    expect(document.body).toHaveClass("codelists");
    expect(document.body).toHaveClass("p-overflow-hidden");
    expect(document.body).not.toHaveClass("structures");
  });
});
