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

vi.mock("./general", () => ({
  default: () => null,
}));

vi.mock("./members", () => ({
  default: () => null,
}));

vi.mock("../menu", () => ({
  Menu: ({ isValidated }: { isValidated: boolean }) => (
    <div data-testid="menu" data-validated={String(isValidated)} />
  ),
}));

describe("CollectionVisualization — isValidated prop forwarded to Menu", () => {
  const renderWith = (isValidated: boolean) =>
    render(
      <CollectionVisualization
        id="1"
        general={{ id: "1", prefLabelLg1: "label", creator: "", isValidated }}
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
