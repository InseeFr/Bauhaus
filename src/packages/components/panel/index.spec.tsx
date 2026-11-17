import { render, screen } from "@testing-library/react";

import { Panel } from ".";

describe("Panel", () => {
  it("renders the content in a region named by its title", () => {
    render(<Panel title="Définition">contenu de la note</Panel>);

    expect(screen.getByRole("region", { name: "Définition" })).toHaveTextContent(
      "contenu de la note",
    );
  });

  it("renders the title as a level 3 heading", () => {
    render(<Panel title="Définition">contenu de la note</Panel>);

    expect(screen.getByRole("heading", { level: 3, name: "Définition" })).toBeInTheDocument();
  });

  it("renders the content without heading nor region when there is no title", () => {
    render(<Panel>contenu seul</Panel>);

    expect(screen.getByText("contenu seul")).toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });
});
