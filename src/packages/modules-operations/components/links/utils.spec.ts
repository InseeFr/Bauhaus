import { getSeeAlsoByType } from "./utils";

describe("getSeeAlsoByType", () => {
  it("should return the array of seeAlsos grouped by type", async () => {
    const input = [
      { type: "series", id: 1 },
      { type: "series", id: 2 },
      { type: "operation", id: 1 },
    ];
    const output = {
      series: [
        { type: "series", id: 1 },
        { type: "series", id: 2 },
      ],
      operation: [{ type: "operation", id: 1 }],
    };
    expect(getSeeAlsoByType(input)).toEqual(output);
  });
});
