import { screen } from "@testing-library/react";

import { renderWithRouter } from "../../tests/render";
import { DisplayLinks } from "./DisplayLinks";

describe("DisplayLinks", () => {
  it("should display a list if we have multiple item", () => {
    const links = [{ id: 1 }, { id: 2 }];
    const { container } = renderWithRouter(
      <DisplayLinks links={links} path="series/" title="home" />,
    );
    const items = container.querySelectorAll("li > a");
    expect([...items].map((a) => a.getAttribute("href"))).toEqual(["/series/1", "/series/2"]);
  });
  it("should display a paragraph if we have only one item", () => {
    const links = [{ id: 1 }];
    const { container } = renderWithRouter(
      <DisplayLinks links={links} path="series/" title="home" />,
    );

    expect(container.querySelector("li")).toBeNull();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/series/1");
  });
  it("should not display a link", () => {
    const links = [{ id: 1, labelLg1: "labelLg1" }];
    const { container } = renderWithRouter(
      <DisplayLinks links={links} path="series/" displayLink={false} title="home" />,
    );
    expect(container.innerHTML).toContain("<p>labelLg1");
  });
});
