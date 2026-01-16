import { z } from "zod";

import { formatValidation } from "./validation";

describe("formatValidation", () => {
  const ZodObject = z.object({
    name: z.string().min(1, "Name is required"),
    age: z.number().min(18, "Age must be at least 18"),
    email: z.string().email("Invalid email format"),
  });

  const validate = formatValidation(ZodObject);

  it("should return no errors for valid input", () => {
    const values = {
      name: "John Doe",
      age: 25,
      email: "john.doe@example.com",
    };

    const result = validate(values);

    expect(result).toEqual({
      fields: {
        name: "",
        age: "",
        email: "",
      },
      errorMessage: [],
    });
  });

  it("should return errors for invalid input", () => {
    const values = {
      name: "",
      age: 16,
      email: "invalid-email",
    };

    const result = validate(values);

    expect(result.fields).toEqual({
      name: "Name is required",
      age: "Age must be at least 18",
      email: "Invalid email format",
    });

    expect(result.errorMessage).toEqual([
      "Name is required",
      "Age must be at least 18",
      "Invalid email format",
    ]);
  });

  it("should return partial errors for partially valid input", () => {
    const values = {
      name: "Jane Doe",
      age: 17,
      email: "jane.doe@example.com",
    };

    const result = validate(values);

    expect(result.fields).toEqual({
      name: "",
      age: "Age must be at least 18",
      email: "",
    });

    expect(result.errorMessage).toEqual(["Age must be at least 18"]);
  });
});
