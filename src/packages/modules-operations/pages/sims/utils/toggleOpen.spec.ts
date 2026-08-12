import { toggleOpen } from "./toggleOpen";

describe("toggleOpen", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should toggle the state from false to true when it is not set", () => {
    toggleOpen("test-id");
    const storedData = JSON.parse(localStorage.getItem("HELP_COLLAPSED") || "{}");
    expect(storedData["test-id"]).toBe(true);
  });

  it("should toggle the state from true to false", () => {
    localStorage.setItem("HELP_COLLAPSED", JSON.stringify({ "test-id": true }));
    toggleOpen("test-id");
    const storedData = JSON.parse(localStorage.getItem("HELP_COLLAPSED") || "{}");
    expect(storedData["test-id"]).toBe(false);
  });

  it("should not affect other ids in the storage", () => {
    localStorage.setItem("HELP_COLLAPSED", JSON.stringify({ "other-id": true }));
    toggleOpen("test-id");
    const storedData = JSON.parse(localStorage.getItem("HELP_COLLAPSED") || "{}");
    expect(storedData["other-id"]).toBe(true);
    expect(storedData["test-id"]).toBe(true);
  });

  it("should handle empty localStorage gracefully", () => {
    toggleOpen("test-id");
    const storedData = JSON.parse(localStorage.getItem("HELP_COLLAPSED") || "{}");
    expect(storedData["test-id"]).toBe(true);
  });
});
