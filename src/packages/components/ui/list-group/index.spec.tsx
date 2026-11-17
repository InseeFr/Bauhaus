import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { List } from "./index";
import { getListItems } from "./testing";

const HALF_OPACITY = { opacity: 0.5 };

describe("<List.Container />", () => {
  it("rend un ul portant la classe de liste de l'application, sans classe Bootstrap", () => {
    const { container } = render(<List.Container />);

    const list = container.querySelector("ul");
    expect(list).toHaveClass("bauhaus-list");
    expect(list).not.toHaveClass("list-group");
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

    expect(container.querySelector("ul")).toHaveClass("bauhaus-list", "ma-liste");
  });
});

describe("<List.Item />", () => {
  it("rend un li portant la classe d'élément de liste de l'application, sans classe Bootstrap", () => {
    const { container } = render(<List.Item>Contenu</List.Item>);

    const item = container.querySelector("li");
    expect(item).toHaveClass("bauhaus-list-item");
    expect(item).not.toHaveClass("list-group-item");
  });

  it("conserve les classes fournies par l'appelant", () => {
    const { container } = render(<List.Item className="documentbloc__item">Contenu</List.Item>);

    expect(container.querySelector("li")).toHaveClass("bauhaus-list-item", "documentbloc__item");
  });

  it("transmet les attributs natifs du li", async () => {
    const handleClick = vi.fn();
    render(
      <List.Item onClick={handleClick} style={HALF_OPACITY}>
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

describe("getListItems", () => {
  it("retourne les éléments de liste dans l'ordre du rendu", () => {
    const { container } = render(
      <List.Container>
        <List.Item>Premier</List.Item>
        <List.Item>Deuxième</List.Item>
      </List.Container>,
    );

    expect(getListItems(container).map((item) => item.textContent)).toEqual([
      "Premier",
      "Deuxième",
    ]);
  });

  it("ignore les li qui ne viennent pas de List.Item, comme ceux d'une pagination", () => {
    const { container } = render(
      <>
        <List.Container>
          <List.Item>Résultat</List.Item>
        </List.Container>
        <nav>
          <ul>
            <li>1</li>
            <li>2</li>
          </ul>
        </nav>
      </>,
    );

    expect(getListItems(container).map((item) => item.textContent)).toEqual(["Résultat"]);
  });
});
