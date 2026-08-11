import { flattenTree } from "./flattenTree";

describe("flattenTree", () => {
  it("should return the right flat array", () => {
    const output = {
      1: {
        children: {
          4: { children: {}, idMas: "4", idParent: "1" },
          5: { children: {}, idMas: "5", idParent: "1" },
          6: { children: {}, idMas: "6", idParent: "1" },
        },
        idMas: "1",
      },
      10: { children: {}, idMas: "10", idParent: "8" },
      11: { children: {}, idMas: "11", idParent: "9" },
      12: { children: {}, idMas: "12", idParent: "3" },
      2: {
        children: {
          7: { children: {}, idMas: "7", idParent: "2" },
          8: {
            children: { 10: { children: {}, idMas: "10", idParent: "8" } },
            idMas: "8",
            idParent: "2",
          },
        },
        idMas: "2",
      },
      3: {
        children: {
          12: { children: {}, idMas: "12", idParent: "3" },
          9: {
            children: { 11: { children: {}, idMas: "11", idParent: "9" } },
            idMas: "9",
            idParent: "3",
          },
        },
        idMas: "3",
      },
      4: { children: {}, idMas: "4", idParent: "1" },
      5: { children: {}, idMas: "5", idParent: "1" },
      6: { children: {}, idMas: "6", idParent: "1" },
      7: { children: {}, idMas: "7", idParent: "2" },
      8: {
        children: { 10: { children: {}, idMas: "10", idParent: "8" } },
        idMas: "8",
        idParent: "2",
      },
      9: {
        children: { 11: { children: {}, idMas: "11", idParent: "9" } },
        idMas: "9",
        idParent: "3",
      },
    };
    const input = {
      1: {
        idMas: "1",
        children: {
          4: {
            idMas: "4",
            idParent: "1",
            children: {},
          },
          5: {
            idMas: "5",
            idParent: "1",
            children: {},
          },
          6: {
            idMas: "6",
            idParent: "1",
            children: {},
          },
        },
      },
      2: {
        idMas: "2",
        children: {
          7: {
            idMas: "7",
            idParent: "2",
            children: {},
          },
          8: {
            idMas: "8",
            idParent: "2",
            children: {
              10: {
                idMas: "10",
                idParent: "8",
                children: {},
              },
            },
          },
        },
      },
      3: {
        idMas: "3",
        children: {
          9: {
            idMas: "9",
            idParent: "3",
            children: {
              11: {
                idMas: "11",
                idParent: "9",
                children: {},
              },
            },
          },
          12: {
            idMas: "12",
            idParent: "3",
            children: {},
          },
        },
      },
    };
    expect(flattenTree(input)).toEqual(output);
  });
});
