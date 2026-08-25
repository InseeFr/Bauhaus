import { filterFromDate } from "./filter-from-date";

const items = [
  { id: "longBefore", date: "2024-03-05T08:00:00.000Z" },
  { id: "sameDay", date: "2024-03-10T08:00:00.000Z" },
  { id: "after", date: "2024-03-12T08:00:00.000Z" },
];

// The DatePicker always emits the UTC midnight of the selected day.
const march10 = "2024-03-10T00:00:00.000Z";

describe("filterFromDate", () => {
  it("returns every item when no date is selected", () => {
    expect(filterFromDate(items, "date", undefined)).toEqual(items);
  });

  it("keeps the items of the selected day and the following ones", () => {
    expect(filterFromDate(items, "date", march10).map((item) => item.id)).toEqual([
      "sameDay",
      "after",
    ]);
  });

  it("drops the items dated before the selected day", () => {
    expect(filterFromDate(items, "date", march10).map((item) => item.id)).not.toContain(
      "longBefore",
    );
  });
});
