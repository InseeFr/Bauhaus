import { isOpen } from "./isOpen";

describe("isOpen", () => {
  beforeEach(() => {
    localStorage.setItem(
      "HELP_COLLAPSED",
      JSON.stringify({
        2: true,
        3: false,
      }),
    );
  });
  it("should return false as a default value", () => {
    const input = "1";
    const output = isOpen(input);
    expect(output).toBeFalsy();
  });
  it("should return false if the item is closed", () => {
    const input = "3";
    const output = isOpen(input);
    expect(output).toBeFalsy();
  });

  it("should return true if the item is opened", () => {
    const input = "2";
    const output = isOpen(input);
    expect(output).toBeTruthy();
  });
});
