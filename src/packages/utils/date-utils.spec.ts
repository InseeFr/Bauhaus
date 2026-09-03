import { isDateIn, isOutOfDate, stringToDate, today } from "./date-utils";

describe("is date in", () => {
  it("returns true if the start and end dates are null", () => {
    const toTest = "2017-06-25T10:51:47.812";
    expect(isDateIn(toTest, null as unknown as Date, null as unknown as Date)).toBe(true);
  });

  it("returns true if the dates match", () => {
    const toTest = "2017-07-15T10:51:47.812";
    const start = "2017-07-01T10:51:47.812";
    const end = "2017-07-31T10:51:47.812";
    expect(isDateIn(toTest, start, end)).toBe(true);
  });

  it("returns false if the dates do not match", () => {
    const toTest = "2017-06-25T10:51:47.812";
    const start = "2017-07-01T10:51:47.812";
    const end = "2017-07-31T10:51:47.812";
    expect(isDateIn(toTest, start, end)).toBe(false);
  });
});

describe("has date passed", () => {
  it("returns false if the end date is null", () => {
    expect(isOutOfDate(null as unknown as Date)).toBe(false);
  });

  it("returns false if the date has not passed", () => {
    const end = "2099-07-31T10:51:47.812";
    expect(isOutOfDate(end)).toBe(false);
  });

  it("returns true if the date has passed", () => {
    const end = "2000-07-31T10:51:47.812";
    expect(isOutOfDate(end)).toBe(true);
  });
});

["browserLanguage", "language"].forEach((property) => {
  test(`should return the french version when the navigator.${property} is FR`, () => {
    expect(stringToDate("1988-02-28T10:51:47.812", "fr")).toEqual("28/02/1988");
  });

  test(`should return the english version when the navigator.${property} is EN`, () => {
    expect(stringToDate("1988-02-28T10:51:47.812", "en")).toEqual("02/28/1988");
  });
});

describe("is date in - bounds", () => {
  it("returns false when the date is exactly the start bound", () => {
    const bound = "2017-07-01T10:51:47.812";
    expect(isDateIn(bound, bound, "2017-07-31T10:51:47.812")).toBe(false);
  });

  it("returns false when the date is exactly the end bound", () => {
    const bound = "2017-07-31T10:51:47.812";
    expect(isDateIn(bound, "2017-07-01T10:51:47.812", bound)).toBe(false);
  });
});

describe("today", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the current date formatted in the browser lang", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("1988-02-28T10:51:47.812"));
    expect(today()).toEqual("02/28/1988");
  });
});
