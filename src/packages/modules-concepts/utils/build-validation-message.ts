import { isOutOfDate, stringToDate } from "../../utils/date-utils";

export const getModalMessage = (array: { prefLabelLg1: string; valid: string }[]) =>
  array.reduce((message, { prefLabelLg1, valid }) => {
    message += `<p>Le concept " <b>${prefLabelLg1}</b> " ayant une date de fin de validité au <b>${stringToDate(
      valid,
    )}</b>, vous ne pourrez plus le modifier`;
    message += isOutOfDate(valid) ? `.</p>` : ` après cette date.</p>`;
    return message;
  }, "");
