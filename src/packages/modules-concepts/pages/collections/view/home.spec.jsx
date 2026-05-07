import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import CollectionVisualization from "./home";

vi.mock("@utils/hooks/useTitle", () => ({
  useTitle: vi.fn(),
}));

vi.mock("@utils/hooks/collections", () => ({
  useCollectionExporter: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock("@components/check-second-lang", () => ({
  CheckSecondLang: () => null,
}));

vi.mock("@components/page-title", () => ({
  PageTitle: () => null,
}));

vi.mock("@components/page-sub-title", () => ({
  PageSubtitle: () => null,
}));

vi.mock("./components/general", () => ({
  default: () => null,
}));

vi.mock("./components/members", () => ({
  default: () => null,
}));

vi.mock("./menu", () => ({
  Menu: ({ isValidated }) => <div data-testid="menu" data-validated={String(isValidated)} />,
}));

describe("CollectionVisualization — isValidated prop forwarded to Menu", () => {
  const renderWith = (isValidated) =>
    render(
      <CollectionVisualization
        id="1"
        general={{ prefLabelLg1: "label", isValidated }}
        members={[]}
        validateCollection={vi.fn()}
        secondLang={false}
      />,
    );

  it("forwards true when general.isValidated is the boolean true", () => {
    renderWith(true);
    expect(screen.getByTestId("menu").dataset.validated).toBe("true");
  });

  it("forwards false when general.isValidated is the boolean false", () => {
    renderWith(false);
    expect(screen.getByTestId("menu").dataset.validated).toBe("false");
  });
});
