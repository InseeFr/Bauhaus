import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { RubricEssentialMsg } from "./RubricEssentialMsg";

vi.mock("react-i18next", async () => ({
  ...(await vi.importActual<typeof import("react-i18next")>("react-i18next")),
  useTranslation: () => ({
    t: (key: string, options?: any) =>
      options?.nb === undefined
        ? `${key}${options?.lng ? `.${options.lng}` : ""}`
        : `${key}:${options.nb}/${options.total}${options.lng ? `.${options.lng}` : ""}`,
  }),
}));

const useEssentialRubricContext = vi.fn();
vi.mock("../hooks/useEssentialRubricContext", () => ({
  useEssentialRubricContext: () => useEssentialRubricContext(),
}));

describe("RubricEssentialMsg", () => {
  beforeEach(() => vi.clearAllMocks());

  it("compte les rubriques essentielles renseignées sur le total attendu", () => {
    useEssentialRubricContext.mockReturnValue({
      S1: { minOccurs: "1", essentialRubricKoLg1: true },
      S2: { minOccurs: "1" },
      S3: { minOccurs: "1" },
      // Rubrique non essentielle : hors du décompte.
      S4: { minOccurs: "0" },
    });

    render(<RubricEssentialMsg secondLang={false} />);

    expect(screen.getByText("sims.essentialRubricMsgPlural:2/3")).toBeInTheDocument();
  });

  it("passe au singulier quand une seule rubrique est renseignée", () => {
    useEssentialRubricContext.mockReturnValue({
      S1: { minOccurs: "1" },
      S2: { minOccurs: "1", essentialRubricKoLg1: true },
    });

    render(<RubricEssentialMsg secondLang={false} />);

    expect(screen.getByText("sims.essentialRubricMsg:1/2")).toBeInTheDocument();
  });

  it("compte séparément les deux langues quand la seconde est affichée", () => {
    useEssentialRubricContext.mockReturnValue({
      S1: { minOccurs: "1", essentialRubricKoLg2: true },
      S2: { minOccurs: "1", essentialRubricKoLg2: true },
      S3: { minOccurs: "1" },
    });

    render(<RubricEssentialMsg secondLang />);

    expect(screen.getByText("sims.essentialRubricMsgPlural:3/3")).toBeInTheDocument();
    expect(screen.getByText("sims.essentialRubricMsg:1/3.en")).toBeInTheDocument();
  });

  it("n'affiche qu'un bloc hors seconde langue", () => {
    useEssentialRubricContext.mockReturnValue({ S1: { minOccurs: "1" } });

    render(<RubricEssentialMsg secondLang={false} />);

    expect(screen.queryByText(/\.en$/)).not.toBeInTheDocument();
  });

  it("tolère une structure sans aucune rubrique essentielle", () => {
    useEssentialRubricContext.mockReturnValue({});

    render(<RubricEssentialMsg secondLang={false} />);

    expect(screen.getByText("sims.essentialRubricMsgPlural:0/0")).toBeInTheDocument();
  });
});
