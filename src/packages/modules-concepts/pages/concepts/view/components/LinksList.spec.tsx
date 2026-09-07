import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  BROADER,
  CLOSE_MATCH,
  IS_REPLACED_BY,
  NARROWER,
  REFERENCES,
  RELATED,
  SUCCEED,
} from "@sdk/constants";

import { LinksList } from "./LinksList";

const getFixedT = vi.fn();
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ i18n: { getFixedT: (language: string) => getFixedT(language) } }),
}));

vi.mock("./InternalLinks", () => ({
  InternalLinks: ({ links, title, labelProperty }: any) => (
    <dd>
      {title}|{labelProperty}|{links.length}
    </dd>
  ),
}));
vi.mock("./CloseMatchLinks", () => ({
  CloseMatchLinks: ({ links, Dictionnary }: any) => (
    <dd>
      équivalents|{links.length}|{Dictionnary.closeMatchTitle}
    </dd>
  ),
}));

const links = {
  [NARROWER]: [{ id: "c1" }],
  [BROADER]: [],
  [REFERENCES]: [],
  [SUCCEED]: [],
  [RELATED]: [],
  [CLOSE_MATCH]: [{ id: "c2" }, { id: "c3" }],
  [IS_REPLACED_BY]: [],
} as any;

describe("LinksList", () => {
  it("rend une entrée par type de lien, plus les équivalents", () => {
    getFixedT.mockReturnValue((key: string) => key);
    render(<LinksList links={links} lang="lg1" alone />);

    expect(screen.getByText("concept.links.narrowerTitle|prefLabelLg1|1")).toBeInTheDocument();
    expect(screen.getByText("concept.links.broaderTitle|prefLabelLg1|0")).toBeInTheDocument();
    expect(screen.getByText(/^équivalents\|2\|/)).toBeInTheDocument();
  });

  it("lit les libellés de seconde langue quand on lui demande lg2", () => {
    getFixedT.mockReturnValue((key: string) => key);
    render(<LinksList links={links} lang="lg2" alone={false} />);

    expect(screen.getByText("concept.links.narrowerTitle|prefLabelLg2|1")).toBeInTheDocument();
  });

  it("traduit dans la langue demandée, pas dans celle de l'utilisateur", () => {
    getFixedT.mockReturnValue((key: string) => `EN:${key}`);
    render(<LinksList links={links} lang="lg2" alone={false} language="en" />);

    expect(getFixedT).toHaveBeenCalledWith("en");
    expect(screen.getByText("EN:concept.links.narrowerTitle|prefLabelLg2|1")).toBeInTheDocument();
  });

  it("traduit en français par défaut", () => {
    getFixedT.mockReturnValue((key: string) => key);
    render(<LinksList links={links} lang="lg1" alone />);

    expect(getFixedT).toHaveBeenCalledWith("fr");
  });
});
