import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";

import { Ddi4Plugin } from "./Ddi4Plugin";

describe("Ddi4Plugin", () => {
  it("déplie un tableau depuis un vrai bouton, au clavier", async () => {
    render(<Ddi4Plugin data={["premier"]} />);

    const toggler = screen.getByRole("button", { name: "▶ [1]" });
    expect(toggler).toHaveAttribute("aria-expanded", "false");
    toggler.focus();

    await userEvent.keyboard("{Enter}");

    expect(toggler).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText('"premier"')).toBeInTheDocument();
  });

  it("déplie un objet depuis un vrai bouton", async () => {
    render(<Ddi4Plugin data={{ id: "i-1" }} />);

    await userEvent.click(screen.getByRole("button", { name: "▶ {1}" }));

    expect(screen.getByText('"i-1"')).toBeInTheDocument();
  });

  it("n'offre pas de bouton pour un tableau vide", () => {
    render(<Ddi4Plugin data={[]} />);

    expect(screen.queryByRole("button", { name: /\[0\]/ })).not.toBeInTheDocument();
    expect(screen.getByText("[0]")).toBeInTheDocument();
  });
});
