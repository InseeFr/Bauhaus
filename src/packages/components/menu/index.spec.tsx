import { screen, within } from "@testing-library/react";

import { renderWithRouter } from "../../tests/render";
import { MainMenu } from "./index";

const path = (overrides: Record<string, unknown>) => ({
  className: null,
  attrs: null,
  ...overrides,
});

const linkNames = (list: HTMLElement) =>
  within(list)
    .getAllByRole("link")
    .map((link) => link.textContent);

describe("MainMenu", () => {
  it("renders a navigation landmark starting with the home link, then the paths by order", () => {
    renderWithRouter(
      <MainMenu
        paths={[
          path({ path: "/b", label: "Second", order: 2 }),
          path({ path: "/a", label: "First", order: 1 }),
        ]}
      />,
    );

    const [left] = within(screen.getByRole("navigation")).getAllByRole("list");
    expect(linkNames(left)).toEqual(["Home", "First", "Second"]);
    expect(screen.getByRole("link", { name: "First" })).toHaveAttribute("href", "/a");
  });

  it("hides the paths that should not be displayed", () => {
    renderWithRouter(
      <MainMenu
        paths={[path({ path: "/hidden", label: "Hidden", order: 1, shouldBeDisplayed: false })]}
      />,
    );

    expect(screen.queryByRole("link", { name: "Hidden" })).toBeNull();
  });

  it("groups the right-aligned paths in a second list", () => {
    renderWithRouter(
      <MainMenu
        paths={[
          path({ path: "/a", label: "Left", order: 1 }),
          path({ path: "/admin", label: "Admin", order: 2, alignToRight: true }),
          path({ path: "/help", label: "Help", order: 3, alignToRight: true }),
        ]}
      />,
    );

    const [left, right] = within(screen.getByRole("navigation")).getAllByRole("list");
    expect(linkNames(left)).toEqual(["Home", "Left"]);
    expect(linkNames(right)).toEqual(["Admin", "Help"]);
  });

  it("marks the current path as active", () => {
    renderWithRouter(
      <MainMenu
        paths={[
          path({
            path: "/a",
            label: "Current",
            order: 1,
            className: "active",
            attrs: { "aria-current": "page" },
          }),
        ]}
      />,
    );

    const current = screen.getByRole("link", { name: "Current" });
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current.closest("li")).toHaveClass("active");
  });

  it("puts a separator after every item but the last of each list", () => {
    renderWithRouter(
      <MainMenu
        paths={[
          path({ path: "/a", label: "Left", order: 1 }),
          path({ path: "/admin", label: "Admin", order: 2, alignToRight: true }),
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: "Home" }).closest("li")).toHaveClass("with-separator");
    expect(screen.getByRole("link", { name: "Left" }).closest("li")).not.toHaveClass(
      "with-separator",
    );
    expect(screen.getByRole("link", { name: "Admin" }).closest("li")).not.toHaveClass(
      "with-separator",
    );
  });

  it("shows a disabled path as a greyed out entry the user cannot follow", () => {
    renderWithRouter(
      <MainMenu paths={[path({ path: "/soon", label: "Soon", order: 1, disabled: true })]} />,
    );

    expect(screen.queryByRole("link", { name: "Soon" })).toBeNull();
    const entry = screen.getByText("Soon");
    expect(entry).toHaveAttribute("aria-disabled", "true");
    expect(entry.closest("li")).toHaveClass("disabled");
  });
});
