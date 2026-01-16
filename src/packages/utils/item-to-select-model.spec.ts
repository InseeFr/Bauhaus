import { toSelectModel, mergedItemsToSelectModels } from "./item-to-select-model";

describe("toSelectModel", () => {
  it("should return the right select model", () => {
    const items = [
      { id: "1", label: "label1" },
      { id: "2", label: "label2" },
      { id: "3", label: "label3" },
    ];
    const type = "series";
    const output = [
      { id: "1", label: "label1", type: "series", value: "1" },
      { id: "2", label: "label2", type: "series", value: "2" },
      { id: "3", label: "label3", type: "series", value: "3" },
    ];
    expect(toSelectModel(items, type)).toEqual(output);
  });
});
describe("mergedItemsToSelectModels", () => {
  it("should return the right select model", () => {
    const input1 = [
      { id: 1, label: "zabel1", type: "series", value: 1 },
      { id: 2, label: "babel2", type: "series", value: 2 },
      { id: 3, label: "aabel3", type: "series", value: 3 },
    ];
    const input2 = [
      { id: 1, label: "rabel1", type: "indicator", value: 1 },
      { id: 2, label: "tabel2", type: "indicator", value: 2 },
      { id: 3, label: "vabel3", type: "indicator", value: 3 },
    ];
    const output = [
      { id: 3, label: "series - aabel3", type: "series", value: 3 },
      { id: 2, label: "series - babel2", type: "series", value: 2 },
      { id: 1, label: "indicator - rabel1", type: "indicator", value: 1 },
      { id: 2, label: "indicator - tabel2", type: "indicator", value: 2 },
      { id: 3, label: "indicator - vabel3", type: "indicator", value: 3 },
      { id: 1, label: "series - zabel1", type: "series", value: 1 },
    ];
    expect(mergedItemsToSelectModels(input1, input2)).toEqual(output);
  });
});
