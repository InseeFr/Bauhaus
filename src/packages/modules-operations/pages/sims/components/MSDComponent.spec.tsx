import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { getItem, setItem } from "@utils/localStorage";
import { MSDComponent } from "./MSDComponent";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@utils/localStorage", () => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
}));

vi.mock("./Outline", () => ({
  Outline: ({ metadataStructure, baseUrl, disableSectionAnchor }: any) => (
    <li>
      {metadataStructure.idMas}|{baseUrl}|{String(disableSectionAnchor)}
    </li>
  ),
}));

const metadataStructure = {
  A: { idMas: "A" },
  B: { idMas: "B" },
} as any;

const renderLayout = () =>
  render(
    <MSDComponent
      metadataStructure={metadataStructure}
      storeCollapseState={false}
      baseUrl="/operations/sims"
      disableSectionAnchor={false}
    >
      <p>contenu du rapport</p>
    </MSDComponent>,
  );

// Les deux panneaux se distinguent par leur classe : le libellé du sommaire est aussi
// celui du bouton qui le rouvre, il ne peut donc pas servir de repère.
const summary = () => document.querySelector<HTMLElement>("section.msd-outline")!;
const content = () => screen.getByText("contenu du rapport").parentElement!;

describe("MSDComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getItem).mockReturnValue(null as any);
  });

  it("rend un élément de sommaire par rubrique de la structure, et le contenu", () => {
    renderLayout();

    expect(screen.getByText("A|/operations/sims|false")).toBeInTheDocument();
    expect(screen.getByText("B|/operations/sims|false")).toBeInTheDocument();
    expect(screen.getByText("contenu du rapport")).toBeInTheDocument();
  });

  it("partage l'écran entre sommaire et contenu par défaut", () => {
    renderLayout();

    expect(summary()).toHaveStyle({ width: "30%", display: "block" });
    expect(content()).toHaveStyle({ width: "70%", display: "block" });
  });

  it("réduit l'écran au contenu seul, et mémorise le choix", async () => {
    renderLayout();

    await userEvent.click(screen.getByTitle("open content"));

    expect(summary()).toHaveStyle({ display: "none" });
    expect(content()).toHaveStyle({ width: "100%" });
    expect(setItem).toHaveBeenCalledWith("HELP_VIEW", "CONTENT");
  });

  it("réduit l'écran au sommaire seul, et mémorise le choix", async () => {
    renderLayout();

    await userEvent.click(screen.getByTitle("open summary"));

    expect(content()).toHaveStyle({ display: "none" });
    expect(summary()).toHaveStyle({ width: "100%" });
    expect(setItem).toHaveBeenCalledWith("HELP_VIEW", "SUMMARY");
  });

  it("revient au partagé depuis le contenu seul", async () => {
    vi.mocked(getItem).mockReturnValue("CONTENT" as any);
    renderLayout();

    await userEvent.click(screen.getByRole("button", { name: /sims.helpSummary/ }));

    expect(summary()).toHaveStyle({ width: "30%", display: "block" });
    expect(setItem).toHaveBeenCalledWith("HELP_VIEW", "BOTH");
  });

  it("revient au partagé depuis le sommaire seul", async () => {
    vi.mocked(getItem).mockReturnValue("SUMMARY" as any);
    renderLayout();

    await userEvent.click(screen.getByRole("button", { name: /sims.helpContent/ }));

    expect(content()).toHaveStyle({ width: "70%", display: "block" });
    expect(setItem).toHaveBeenCalledWith("HELP_VIEW", "BOTH");
  });

  it("repart de la disposition mémorisée au montage", () => {
    vi.mocked(getItem).mockReturnValue("SUMMARY" as any);
    renderLayout();

    expect(getItem).toHaveBeenCalledWith("HELP_VIEW");
    expect(content()).toHaveStyle({ display: "none" });
  });
});
