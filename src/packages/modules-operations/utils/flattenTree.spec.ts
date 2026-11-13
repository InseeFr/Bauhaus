import { flattenTree } from "./flattenTree";

const leaf = (idMas: string, idParent: string) => ({ idMas, idParent, children: {} });

const node4 = leaf("4", "1");
const node5 = leaf("5", "1");
const node6 = leaf("6", "1");
const node7 = leaf("7", "2");
const node10 = leaf("10", "8");
const node11 = leaf("11", "9");
const node12 = leaf("12", "3");

const node8 = { idMas: "8", idParent: "2", children: { 10: node10 } };
const node9 = { idMas: "9", idParent: "3", children: { 11: node11 } };

const node1 = { idMas: "1", children: { 4: node4, 5: node5, 6: node6 } };
const node2 = { idMas: "2", children: { 7: node7, 8: node8 } };
const node3 = { idMas: "3", children: { 9: node9, 12: node12 } };

describe("flattenTree", () => {
  it("should return the right flat array", () => {
    const input = { 1: node1, 2: node2, 3: node3 };

    // Chaque nœud, à quelque profondeur qu'il soit, devient une entrée de premier niveau,
    // sans perdre ses propres enfants.
    expect(flattenTree(input)).toEqual({
      1: node1,
      2: node2,
      3: node3,
      4: node4,
      5: node5,
      6: node6,
      7: node7,
      8: node8,
      9: node9,
      10: node10,
      11: node11,
      12: node12,
    });
  });
});
