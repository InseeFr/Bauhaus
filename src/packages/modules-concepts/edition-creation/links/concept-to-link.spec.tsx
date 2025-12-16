import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";

import ConceptToLink from "./concept-to-link";

vi.mock("@components/layout", () => ({
  Row: ({ children }: { children: React.ReactNode }) => <div data-testid="row">{children}</div>,
}));
vi.mock("@components/panel", () => ({
  Panel: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div data-testid="panel">
      <h2>{title}</h2>
      {children}
    </div>
  ),
}));

describe("ConceptToLink Component", () => {
  it("renders the component with the correct props", () => {
    const title = "Test Panel Title";
    const memberElements = [<div key="1">Member 1</div>, <div key="2">Member 2</div>];
    const searchComponent = <input type="text" placeholder="Search" />;

    render(
      <ConceptToLink title={title} memberEls={memberElements} searchComponent={searchComponent} />,
    );

    screen.getByTestId("row");

    screen.getByTestId("panel");
    screen.getByText(title);

    memberElements.forEach((member) => {
      screen.getByText(member.props.children);
    });

    screen.getByPlaceholderText("Search");
  });
});
