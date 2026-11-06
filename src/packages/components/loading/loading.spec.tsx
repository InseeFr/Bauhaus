import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";

import { componentsI18n } from "../i18n";
import { Loading, Deleting, Publishing, Saving, Exporting } from "./";

vi.mock("primereact/progressspinner", () => ({
  ProgressSpinner: () => <div data-testid="progress-spinner">Spinner</div>,
}));

const expectStatusText = (text: string) => {
  const statusElement = screen.getByRole("status");
  expect(statusElement).toHaveAttribute("aria-label", text);
  expect(screen.getByText(text)).toBeInTheDocument();
};

describe("Loading Component", () => {
  it("renders with default loading text", () => {
    render(<Loading />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expectStatusText(componentsI18n.t("loading.loading"));
  });

  it("renders with custom text", () => {
    const customText = "Custom loading text";
    render(<Loading text={customText} />);
    expectStatusText(customText);
  });

  it("renders with authentification text type", () => {
    render(<Loading textType="authentification" />);
    expectStatusText(componentsI18n.t("loading.auth"));
  });

  it("renders with saving text type", () => {
    render(<Loading textType="saving" />);
    expectStatusText(componentsI18n.t("loading.saving"));
  });

  it("renders with sending text type", () => {
    render(<Loading textType="sending" />);
    expectStatusText(componentsI18n.t("loading.sending"));
  });

  it("renders with exporting text type", () => {
    render(<Loading textType="exporting" />);
    expectStatusText(componentsI18n.t("loading.exporting"));
  });

  it("has correct accessibility attributes", () => {
    render(<Loading />);
    const statusElement = screen.getByRole("status");
    expect(statusElement).toHaveAttribute("aria-live", "polite");
    expect(statusElement).toHaveAttribute("aria-label");
  });

  it("renders ProgressSpinner component", () => {
    render(<Loading />);
    expect(screen.getByTestId("progress-spinner")).toBeInTheDocument();
  });

  describe("Deleting component", () => {
    it("renders with deleting text type", () => {
      render(<Deleting />);
      expectStatusText(componentsI18n.t("loading.deleting"));
    });
  });

  describe("Publishing component", () => {
    it("renders with validating text type", () => {
      render(<Publishing />);
      expectStatusText(componentsI18n.t("loading.validating"));
    });
  });

  describe("Saving component", () => {
    it("renders with saving text type", () => {
      render(<Saving />);
      expectStatusText(componentsI18n.t("loading.saving"));
    });
  });

  describe("Exporting component", () => {
    it("renders with exporting text type", () => {
      render(<Exporting />);
      expectStatusText(componentsI18n.t("loading.exporting"));
    });
  });
});
