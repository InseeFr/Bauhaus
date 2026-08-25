import { getModalMessage } from "./build-validation-message";

const ONE_DAY = 24 * 60 * 60 * 1000;
const daysFromNow = (days: number) => new Date(Date.now() + days * ONE_DAY).toISOString();

describe("getModalMessage", () => {
  it("should display if the date is out of date", () => {
    const array = [{ prefLabelLg1: "prefLabelLg1", valid: daysFromNow(1) }];

    expect(getModalMessage(array)).toContain("cette date");
  });

  it("should display the correct message if the date is not out of date", () => {
    const array = [{ prefLabelLg1: "prefLabelLg1", valid: daysFromNow(-1) }];

    expect(getModalMessage(array)).not.toContain("cette date");
  });
});
