import { z } from "zod";

import { formatValidation } from "./validation";

const ZodObject = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(18, "Age must be at least 18"),
  email: z.string().email("Invalid email format"),
});

const validate = formatValidation(ZodObject);

const NO_FIELD_ERROR = {
  name: "",
  age: "",
  email: "",
};

const nameRequired = "Name is required";
const ageTooLow = "Age must be at least 18";
const invalidEmail = "Invalid email format";

const cases: {
  name: string;
  values: Parameters<typeof validate>[0];
  expected: ReturnType<typeof validate>;
}[] = [
  {
    name: "should return no errors for valid input",
    values: {
      name: "John Doe",
      age: 25,
      email: "john.doe@example.com",
    },
    expected: {
      fields: NO_FIELD_ERROR,
      errorMessage: [],
    },
  },
  {
    name: "should return errors for invalid input",
    values: {
      name: "",
      age: 16,
      email: "invalid-email",
    },
    expected: {
      fields: {
        name: nameRequired,
        age: ageTooLow,
        email: invalidEmail,
      },
      errorMessage: [nameRequired, ageTooLow, invalidEmail],
    },
  },
  {
    name: "should return partial errors for partially valid input",
    values: {
      name: "Jane Doe",
      age: 17,
      email: "jane.doe@example.com",
    },
    expected: {
      fields: { ...NO_FIELD_ERROR, age: ageTooLow },
      errorMessage: [ageTooLow],
    },
  },
];

describe("formatValidation", () => {
  cases.forEach(({ name, values, expected }) => {
    it(name, () => {
      expect(validate(values)).toEqual(expected);
    });
  });
});
