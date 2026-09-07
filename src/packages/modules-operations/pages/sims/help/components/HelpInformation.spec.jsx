import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { rangeType } from "../../../../constants/rangeType";
import { HelpInformation } from "./HelpInformation";

vi.mock("react-i18next", async () => ({
  ...(await vi.importActual("react-i18next")),
  useTranslation: () => ({ t: (key) => key }),
}));

const codesLists = {
  CL_FREQ: {
    codeListLabelLg1: "Fréquences",
    codes: [
      { code: "A", labelLg1: "Annuelle" },
      { code: "M", labelLg1: "Mensuelle" },
    ],
  },
};

const organisations = [
  { id: "org-1", label: "Insee A040" },
  { id: "org-2", label: "Insee L001" },
];

const renderHelp = (msd) =>
  render(<HelpInformation msd={msd} codesLists={codesLists} organisations={organisations} />);

const baseMsd = {
  masLabelLg1: "Contact",
  masLabelLg2: "Contact EN",
  isPresentational: false,
  rangeType: rangeType.TEXT,
};

describe("HelpInformation", () => {
  it("ne rend rien pour une rubrique sans libellé", () => {
    const { container } = renderHelp({ ...baseMsd, masLabelLg1: undefined });

    expect(container).toBeEmptyDOMElement();
  });

  it("affiche le libellé de seconde langue et le caractère présentationnel", () => {
    renderHelp(baseMsd);

    expect(screen.getByText("Contact EN")).toBeInTheDocument();
    expect(screen.getByText("false")).toBeInTheDocument();
    expect(screen.getByText(`sims.help${rangeType.TEXT}`)).toBeInTheDocument();
  });

  it("n'affiche la cardinalité maximale que lorsqu'elle est définie", () => {
    renderHelp(baseMsd);
    expect(screen.queryByText("sims.helpMaxOccurs:")).not.toBeInTheDocument();

    renderHelp({ ...baseMsd, maxOccurs: "unbounded" });
    expect(screen.getByText("sims.helpMaxOccurs:")).toBeInTheDocument();
    expect(screen.getByText("unbounded")).toBeInTheDocument();
  });

  it("détaille les codes de la liste attendue", () => {
    renderHelp({ ...baseMsd, rangeType: rangeType.CODE_LIST, codeList: "CL_FREQ" });

    expect(screen.getByText(`sims.help${rangeType.CODE_LIST} - Fréquences`)).toBeInTheDocument();
    expect(screen.getByText("Annuelle")).toBeInTheDocument();
    expect(screen.getByText("Mensuelle")).toBeInTheDocument();
  });

  it("se contente du type quand la liste de codes n'est pas chargée", () => {
    renderHelp({ ...baseMsd, rangeType: rangeType.CODE_LIST, codeList: "CL_ABSENTE" });

    expect(screen.getByText(`sims.help${rangeType.CODE_LIST}`)).toBeInTheDocument();
    expect(screen.queryByText("Annuelle")).not.toBeInTheDocument();
  });

  it("liste les organisations pour une rubrique de type organisation", () => {
    renderHelp({ ...baseMsd, rangeType: rangeType.ORGANIZATION });

    expect(screen.getByText("Insee A040")).toBeInTheDocument();
    expect(screen.getByText("Insee L001")).toBeInTheDocument();
  });
});
