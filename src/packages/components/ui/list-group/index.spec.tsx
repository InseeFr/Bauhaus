import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { List } from "./index";

describe("<List.Container />", () => {
  it("rend un ul portant la classe de liste", () => {
    const { container } = render(<List.Container />);

    const list = container.querySelector("ul");
    expect(list).toHaveClass("list-group");
  });

  it("rend ses enfants", () => {
    render(
      <List.Container>
        <List.Item>Premier</List.Item>
      </List.Container>,
    );

    expect(screen.getByText("Premier")).toBeInTheDocument();
  });

  it("conserve les classes fournies par l'appelant", () => {
    const { container } = render(<List.Container className="ma-liste" />);

    expect(container.querySelector("ul")).toHaveClass("list-group", "ma-liste");
  });
});

describe("<List.Item />", () => {
  it("rend un li portant la classe d'élément de liste", () => {
    const { container } = render(<List.Item>Contenu</List.Item>);

    expect(container.querySelector("li")).toHaveClass("list-group-item");
  });

  it("conserve les classes fournies par l'appelant", () => {
    const { container } = render(<List.Item className="documentbloc__item">Contenu</List.Item>);

    expect(container.querySelector("li")).toHaveClass("list-group-item", "documentbloc__item");
  });

  it("transmet les attributs natifs du li", async () => {
    const handleClick = vi.fn();
    render(
      <List.Item onClick={handleClick} style={{ opacity: 0.5 }}>
        Cliquable
      </List.Item>,
    );

    await userEvent.click(screen.getByText("Cliquable"));

    expect(handleClick).toHaveBeenCalledOnce();
    expect(screen.getByText("Cliquable")).toHaveStyle({ opacity: "0.5" });
  });

  it("expose la référence du li, nécessaire au glisser-déposer", () => {
    const ref = createRef<HTMLLIElement>();

    render(<List.Item ref={ref}>Déplaçable</List.Item>);

    expect(ref.current).toBeInstanceOf(HTMLLIElement);
  });
});
