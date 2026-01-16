import dayjs from "dayjs";

import { getModalMessage } from "./build-validation-message";

describe("getModalMessage", () => {
  it("should display if the date is out of date", () => {
    const tomorrow = dayjs().add(1, "days");
    const array = [{ prefLabelLg1: "prefLabelLg1", valid: tomorrow }];

    expect(getModalMessage(array)).toContain("cette date");
  });

  it("should display the correct message if the date is not out of date", () => {
    const yesterday = dayjs().subtract(1, "days");
    const array = [{ prefLabelLg1: "prefLabelLg1", valid: yesterday }];

    expect(getModalMessage(array)).not.toContain("cette date");
  });
});
