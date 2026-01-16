import * as A from "./array-utils";

describe("sortArray", () => {
  it("should return a same length array", () => {
    const array = [
      { id: "2", label: "B" },
      { id: "1", label: "A" },
    ];
    expect(A.sortArray("id")(array)).toHaveLength(array.length);
  });

  it("should return a sorted array", () => {
    const array = [
      { id: "2", label: "B" },
      { id: "1", label: "A" },
    ];
    const res = [
      { id: "1", label: "A" },
      { id: "2", label: "B" },
    ];
    expect(A.sortArray("id")(array)).toEqual(res);
  });
});

describe("nbResults", () => {
  it("should return string ends with any letter", () => {
    expect(A.nbResults([])).toMatch(/[A-Za-z]$/);
    expect(A.nbResults(["A"])).toMatch(/[A-Za-z]$/);
  });

  it("should return string ends with 's'", () => {
    expect(A.nbResults(["a", "b"], "euros", "euro").endsWith("euros")).toBeTruthy();
  });
});

describe("filterKeyDeburr", () => {
  describe("without keys array", () => {
    it("should return true if the value is present", () => {
      expect(A.filterKeyDeburr()("a")({ label: "a" })).toBeTruthy();
    });
    it("should return false if the value is not present", () => {
      expect(A.filterKeyDeburr()("a")({ label: "b" })).toBeFalsy();
    });
  });
  describe("the value is single", () => {
    it("should return true if the value is present", () => {
      expect(A.filterKeyDeburr(["label"])("a")({ label: "a" })).toBeTruthy();
    });
    it("should return false if the value is not present", () => {
      expect(A.filterKeyDeburr(["label"])("a")({ label: "b" })).toBeFalsy();
    });
  });
  describe("the value is multiple", () => {
    it("should return true if the value is present", () => {
      expect(A.filterKeyDeburr(["label"])("a")({ label: ["a"] })).toBeTruthy();
    });
    it("should return false if the value is not present", () => {
      expect(A.filterKeyDeburr(["label"])("a")({ label: ["b"] })).toBeFalsy();
    });
  });
  describe("the key has a full path", () => {
    it("should return true if the value is present", () => {
      expect(
        A.filterKeyDeburr(["components.label"])("a")({
          components: [{ label: "a" }],
        }),
      ).toBeTruthy();
    });
    it("should return true if the value is present in an array", () => {
      expect(
        A.filterKeyDeburr(["components.label"])("a")({
          components: [{ label: ["a"] }],
        }),
      ).toBeTruthy();
    });
    it("should return false if the value is not present", () => {
      expect(
        A.filterKeyDeburr(["components.label"])("b")({
          components: [{ label: ["a"] }],
        }),
      ).toBeFalsy();
    });
  });

  describe("arrayToString", () => {
    it("should return an empty string", () => {
      expect(A.arrayToString([])).toEqual("");
    });
    it("should return a string containing array elements", () => {
      const array = ["aaa", "bbb", "ccc"];
      expect(A.arrayToString(array)).toEqual("aaa - bbb - ccc");
    });
  });

  describe("arrayKeepUniqueField", () => {
    it("should return an array of id objects", () => {
      const array = [
        { id: "1", label: "A" },
        { id: "2", label: "B" },
      ];
      const res = ["a", "b"];
      expect(A.arrayKeepUniqueField(array, "label")).toEqual(res);
    });
  });
  describe("range", () => {
    it("should return an array of integers from start to end - 1", () => {
      expect(A.range(3, 6)).toEqual([3, 4, 5]);
    });
  });
});

describe("array utils", () => {
  describe("filter by key date", () => {
    it("returns true if the date matches", () => {
      const evt = { creationDate: "2017-07-15T10:51:47.812" };
      const start = "2017-07-01T10:51:47.812";
      const end = "2017-07-31T10:51:47.812";
      const filter = A.filterKeyDate("creationDate")(start, end);
      expect(filter(evt)).toBe(true);
    });

    it("returns false if the date does not match", () => {
      const evt = { creationDate: "2017-06-28T10:51:47.812" };
      const start = "2017-07-01T10:51:47.812";
      const end = "2017-07-31T10:51:47.812";
      const filter = A.filterKeyDate("creationDate")(start, end);
      expect(filter(evt)).toBe(false);
    });
  });

  describe("getMembers", () => {
    const array = [{ idLinked: "1", prefLabelLg1: "A", conceptLink: "LINK" }];
    it("should return empty array", () => {
      expect(A.getMembers(array, "LINK_A")).toEqual([]);
    });

    it("should return array", () => {
      expect(A.getMembers(array, "LINK")).toHaveLength(array.length);
      expect(A.getMembers(array, "LINK")).toEqual([
        {
          id: "1",
          prefLabelLg1: "A",
        },
      ]);
    });
  });
});
