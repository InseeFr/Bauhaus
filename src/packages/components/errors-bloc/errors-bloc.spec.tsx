import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { ClientSideError, GlobalClientSideErrorBloc, ErrorBloc } from "./index";

describe("ClientSideError", () => {
  it("renders error message when error is provided", () => {
    render(<ClientSideError error="<strong>Error occurred</strong>" id="error1" />);
    screen.getByText("Error occurred");
  });

  it("does not render anything when error is not provided", () => {
    render(<ClientSideError id="error1" />);
    screen.queryByText("Error occurred");
  });
});

describe("GlobalClientSideErrorBloc", () => {
  it("renders global error message when clientSideErrors are provided", () => {
    render(<GlobalClientSideErrorBloc clientSideErrors={["error1"]} />);
    const errorElement = screen.getByRole("alert");
    expect(errorElement).toHaveTextContent("You have errors in this form.");
  });

  it("does not render anything when clientSideErrors is undefined", () => {
    render(<GlobalClientSideErrorBloc />);
    const errorElement = screen.queryByRole("alert");
    expect(errorElement).toBeNull();
  });

  it("does not render anything when clientSideErrors is an empty array", () => {
    render(<GlobalClientSideErrorBloc clientSideErrors={[]} />);
    const errorElement = screen.queryByRole("alert");
    expect(errorElement).toBeNull();
  });
});

describe("ErrorBloc", () => {
  it("renders formatted errors for an array of error messages", () => {
    const errors = [
      JSON.stringify({ code: "1101" }),
      JSON.stringify({ status: 500, message: "message" }),
      { status: 500, message: "object" },
      "Plain error message",
    ];
    render(<ErrorBloc error={errors} />);

    screen.getByText("The codelist already exists.");
    screen.getByText(
      "An error has occurred. Please contact the RMéS administration team and provide them with the following message: message",
    );
    screen.getByText(
      "An error has occurred. Please contact the RMéS administration team and provide them with the following message: object",
    );
    screen.getByText("Plain error message");
  });

  it("renders a single error message when error is a string", () => {
    render(<ErrorBloc error="Plain error message" />);
    screen.getByText("Plain error message");
  });

  it("renders fallback message when JSON parsing fails", () => {
    const invalidError = "Invalid JSON";
    render(<ErrorBloc error={[invalidError]} />);
    screen.getByText("Invalid JSON");
  });
});
