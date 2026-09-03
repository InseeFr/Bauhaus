import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { SharedCodeListNotice } from "./SharedCodeListNotice";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) =>
      options ? `${key}|${JSON.stringify(options)}` : key,
  }),
}));

describe("SharedCodeListNotice", () => {
  it("renders nothing when the list belongs to this variable alone", () => {
    const { container } = render(<SharedCodeListNotice otherVariableNames={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("names the single other variable that would be impacted", () => {
    render(<SharedCodeListNotice otherVariableNames={["Âge"]} />);

    expect(
      screen.getByText('physicalInstance.view.code.sharedNotice.message|{"count":1}'),
    ).toBeInTheDocument();
    expect(screen.getByText("Âge")).toBeInTheDocument();
  });

  it("counts and enumerates the impacted variables when there are several", () => {
    render(<SharedCodeListNotice otherVariableNames={["Sexe", "Âge"]} />);

    expect(
      screen.getByText('physicalInstance.view.code.sharedNotice.message|{"count":2}'),
    ).toBeInTheDocument();
    expect(screen.getByText("Sexe, Âge")).toBeInTheDocument();
  });

  it("stays out of the accessibility tree as an alert, being a permanent reminder", () => {
    // Un `role="alert"` serait relu à chaque re-rendu du tableau : c'est un rappel de contexte,
    // pas une notification.
    render(<SharedCodeListNotice otherVariableNames={["Âge"]} />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
