import { describe, it, expect } from "vitest";
import { isEmpty } from "./value-utils";

describe("isEmpty", () => {
  describe("Null and undefined values", () => {
    it("should return true for null", () => {
      expect(isEmpty(null)).toBe(true);
    });

    it("should return true for undefined", () => {
      expect(isEmpty(undefined)).toBe(true);
    });
  });

  describe("String values", () => {
    it("should return true for empty string", () => {
      expect(isEmpty("")).toBe(true);
    });

    it("should return true for whitespace-only string with spaces", () => {
      expect(isEmpty("   ")).toBe(true);
    });

    it("should return true for whitespace-only string with tabs", () => {
      expect(isEmpty("\t\t")).toBe(true);
    });

    it("should return true for whitespace-only string with newlines", () => {
      expect(isEmpty("\n\n")).toBe(true);
    });

    it("should return true for mixed whitespace", () => {
      expect(isEmpty(" \t\n ")).toBe(true);
    });

    it("should return false for non-empty string", () => {
      expect(isEmpty("hello")).toBe(false);
    });

    it("should return false for string with leading/trailing whitespace", () => {
      expect(isEmpty("  hello  ")).toBe(false);
    });

    it("should return false for string with only a space in middle", () => {
      expect(isEmpty("a b")).toBe(false);
    });
  });

  describe("Array values", () => {
    it("should return true for empty array", () => {
      expect(isEmpty([])).toBe(true);
    });

    it("should return true for array with only null values", () => {
      expect(isEmpty([null, null])).toBe(true);
    });

    it("should return true for array with only undefined values", () => {
      expect(isEmpty([undefined, undefined])).toBe(true);
    });

    it("should return true for array with only empty strings", () => {
      expect(isEmpty(["", ""])).toBe(true);
    });

    it("should return true for array with only whitespace strings", () => {
      expect(isEmpty(["   ", "\t\t", "\n\n"])).toBe(true);
    });

    it("should return true for array with mixed empty values", () => {
      expect(isEmpty([null, undefined, "", "   "])).toBe(true);
    });

    it("should return true for nested empty arrays", () => {
      expect(isEmpty([[]])).toBe(true);
    });

    it("should return true for deeply nested empty arrays", () => {
      expect(isEmpty([[[]]])).toBe(true);
    });

    it("should return false for array with one valid string", () => {
      expect(isEmpty(["hello"])).toBe(false);
    });

    it("should return false for array with valid and empty values", () => {
      expect(isEmpty([null, "hello", ""])).toBe(false);
    });

    it("should return false for array with numbers", () => {
      expect(isEmpty([1, 2, 3])).toBe(false);
    });

    it("should return false for array with zero", () => {
      expect(isEmpty([0])).toBe(false);
    });

    it("should return false for array with boolean values", () => {
      expect(isEmpty([true])).toBe(false);
      expect(isEmpty([false])).toBe(false);
    });

    it("should return false for array with objects", () => {
      expect(isEmpty([{}])).toBe(false);
    });
  });

  describe("Other types", () => {
    it("should return false for number 0", () => {
      expect(isEmpty(0)).toBe(false);
    });

    it("should return false for positive number", () => {
      expect(isEmpty(42)).toBe(false);
    });

    it("should return false for negative number", () => {
      expect(isEmpty(-1)).toBe(false);
    });

    it("should return false for boolean true", () => {
      expect(isEmpty(true)).toBe(false);
    });

    it("should return false for boolean false", () => {
      expect(isEmpty(false)).toBe(false);
    });

    it("should return false for empty object", () => {
      expect(isEmpty({})).toBe(false);
    });

    it("should return false for object with properties", () => {
      expect(isEmpty({ foo: "bar" })).toBe(false);
    });

    it("should return false for function", () => {
      expect(isEmpty(() => {})).toBe(false);
    });

    it("should return false for Date object", () => {
      expect(isEmpty(new Date())).toBe(false);
    });
  });

  describe("Edge cases", () => {
    it("should handle array with very long whitespace strings", () => {
      const longWhitespace = " ".repeat(1000);
      expect(isEmpty([longWhitespace])).toBe(true);
    });

    it("should handle deeply nested arrays with empty values", () => {
      expect(isEmpty([[null, [undefined, [""]]]])).toBe(true);
    });

    it("should handle deeply nested arrays with valid value at bottom", () => {
      expect(isEmpty([[null, [undefined, ["hello"]]]])).toBe(false);
    });

    it("should handle array with special Unicode whitespace", () => {
      // Non-breaking space (U+00A0)
      expect(isEmpty("\u00A0")).toBe(true);
    });

    it("should handle very large empty array", () => {
      const largeArray = Array.from({ length: 1000 }).fill(null);
      expect(isEmpty(largeArray)).toBe(true);
    });

    it("should handle very large array with one valid value", () => {
      const largeArray = Array.from({ length: 1000 }).fill(null);
      largeArray[500] = "valid";
      expect(isEmpty(largeArray)).toBe(false);
    });
  });

  describe("Real-world use cases", () => {
    it("should handle creator field with empty string", () => {
      const creator = "";
      expect(isEmpty(creator)).toBe(true);
    });

    it("should handle creator field with whitespace", () => {
      const creator = "   ";
      expect(isEmpty(creator)).toBe(true);
    });

    it("should handle creator field with valid value", () => {
      const creator = "DG75-L201";
      expect(isEmpty(creator)).toBe(false);
    });

    it("should handle empty creators array", () => {
      const creators: string[] = [];
      expect(isEmpty(creators)).toBe(true);
    });

    it("should handle creators array with empty strings", () => {
      const creators = ["", "   ", "\t"];
      expect(isEmpty(creators)).toBe(true);
    });

    it("should handle creators array with valid and invalid values", () => {
      const creators = ["DG75-L201", "", null, undefined, "   ", "DG75-L202"];
      expect(isEmpty(creators)).toBe(false);
    });

    it("should handle optional field that is undefined", () => {
      const conceptVersion: string | undefined = undefined;
      expect(isEmpty(conceptVersion)).toBe(true);
    });

    it("should handle optional field that has value", () => {
      const conceptVersion: string | undefined = "2";
      expect(isEmpty(conceptVersion)).toBe(false);
    });
  });
});
