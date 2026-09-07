import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import CollectionVisualization from "./CollectionVisualization";
import type { ValidationState } from "@components/status";
import { UNPUBLISHED, VALIDATED } from "@model/ValidationState";

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

vi.mock("./CollectionGeneral", () => ({
  default: () => null,
}));

vi.mock("./CollectionMembers", () => ({
  default: () => null,
}));

vi.mock("../menu", () => ({
  Menu: ({ validationState }: { validationState?: string }) => (
    <div data-testid="menu" data-validationstate={String(validationState)} />
  ),
}));

describe("CollectionVisualization — validationState prop forwarded to Menu", () => {
  const renderWith = (validationState: ValidationState) =>
    render(
      <CollectionVisualization
        id="1"
        general={{ id: "1", prefLabelLg1: "label", creator: "", validationState }}
        members={[]}
        validateCollection={vi.fn()}
        secondLang={false}
      />,
    );

  it("forwards Validated when general.validationState is Validated", () => {
    renderWith(VALIDATED);
    expect(screen.getByTestId("menu").dataset.validationstate).toBe("Validated");
  });

  it("forwards Unpublished when general.validationState is Unpublished", () => {
    renderWith(UNPUBLISHED);
    expect(screen.getByTestId("menu").dataset.validationstate).toBe("Unpublished");
  });
});
