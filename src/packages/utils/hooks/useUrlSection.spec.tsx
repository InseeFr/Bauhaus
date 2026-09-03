import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";

import { useUrlSection } from "./useUrlSection";

const Probe = ({ fallback = "first" }: { fallback?: string }) => {
  const [section, setSection] = useUrlSection(fallback);
  const { search } = useLocation();
  return (
    <>
      <span data-testid="section">{section}</span>
      <span data-testid="search">{search}</span>
      <button type="button" onClick={() => setSection("notes")}>
        Aller aux notes
      </button>
    </>
  );
};

const renderProbe = (url: string, fallback?: string) =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Probe fallback={fallback} />
    </MemoryRouter>,
  );

describe("useUrlSection", () => {
  it("retient la section indiquée dans l'URL", () => {
    renderProbe("/concepts/c4/modify?section=links");

    expect(screen.getByTestId("section")).toHaveTextContent("links");
  });

  it("se rabat sur la section par défaut quand l'URL n'en indique aucune", () => {
    renderProbe("/concepts/c4/modify", "general");

    expect(screen.getByTestId("section")).toHaveTextContent("general");
  });

  it("écrit la section choisie dans l'URL", () => {
    renderProbe("/concepts/c4/modify");

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByTestId("search")).toHaveTextContent("section=notes");
  });

  it("conserve les autres paramètres de l'URL", () => {
    renderProbe("/concepts/c4/modify?page=2");

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByTestId("search")).toHaveTextContent("page=2");
  });
});
