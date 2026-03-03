import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { Menu } from "./menu";

describe("Menu", () => {
  it("should contains three items", () => {
    render(
      <MemoryRouter initialEntries={["/datasets/distribution"]}>
        <Menu />
      </MemoryRouter>,
    );
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });
});
