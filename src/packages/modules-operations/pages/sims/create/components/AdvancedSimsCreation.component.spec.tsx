import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { OperationsApi } from "@sdk/operations-api";
import { AppContextProvider } from "../../../../../application/app-context";
import { rangeType } from "../../../../constants/rangeType";
import { getSiblingSims } from "../utils/getSiblingSims";
import { AdvancedSimsCreation } from "./AdvancedSimsCreation";

const blocker = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual<typeof import("react-router-dom")>("react-router-dom")),
  useBlocker: (predicate: any) => blocker(predicate),
}));

vi.mock("react-i18next", async () => ({
  ...(await vi.importActual<typeof import("react-i18next")>("react-i18next")),
  useTranslation: () => ({ t: (key: string, options?: any) => `${key}${options?.id ?? ""}` }),
}));

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: {
    getOperationsWithReport: vi.fn(),
    getSeriesWithReport: vi.fn(),
    getIndicatorsListWithSims: vi.fn(),
  },
}));

const goBack = vi.fn();
vi.mock("@utils/hooks/useGoBack", () => ({ useGoBack: () => goBack }));

vi.mock("../utils/getSiblingSims", () => ({ getSiblingSims: vi.fn() }));
vi.mock("../utils/getDefaultSims", () => ({
  getDefaultSims: (_mode: string, rubrics: any) => rubrics,
}));

const documentsStore = vi.fn();
vi.mock("../../hooks/useDocumentsStoreContext", () => ({
  useDocumentsStoreContext: () => documentsStore(),
}));

// Modal met son contenu dans un portail : on le remplace par un rendu conditionnel simple.
vi.mock("react-modal", () => ({
  default: ({ isOpen, children }: any) => (isOpen ? <div>{children}</div> : null),
}));

vi.mock("../../components/RubricEssentialMsg", () => ({
  RubricEssentialMsg: () => <p>rubriques essentielles</p>,
}));

vi.mock("../menu", () => ({
  Menu: ({ goBackUrl, handleSubmit }: any) => (
    <nav>
      <span>retour:{goBackUrl}</span>
      <button onClick={handleSubmit}>enregistrer</button>
    </nav>
  ),
}));

vi.mock("@components/select-rmes", () => ({
  Select: ({ options, onChange, disabled }: any) => (
    <button disabled={disabled} onClick={() => onChange(options[0]?.value)}>
      dupliquer:{options.map((option: any) => option.label).join(",") || "(aucun)"}
    </button>
  ),
}));

vi.mock("./SimsField", () => ({
  SimsFieldMemo: () => null,
  SimsField: ({ msd, secondLang, handleChange, alone }: any) => (
    <button onClick={() => handleChange({ id: msd.idMas, override: { value: "saisi" } })}>
      {`champ:${msd.idMas}|lg${secondLang ? "2" : "1"}|seul:${String(alone)}`}
    </button>
  ),
}));
vi.mock("./SimsDocumentField", () => ({
  SimsDocumentFieldMemo: ({ msd, lang }: any) => (
    <span>{`documents:${msd.idMas}|${lang ?? "Lg1"}`}</span>
  ),
}));
vi.mock("./DocumentFormPanel", () => ({
  DocumentFormPanel: ({ opened, onHide, onAdd }: any) => (
    <div>
      <span>panneau:{String(opened)}</span>
      <button onClick={onHide}>fermer le panneau</button>
      <button onClick={() => onAdd("S1", "lg1", { id: "doc-1" })}>ajouter un document</button>
    </div>
  ),
}));

const metadataStructure = {
  S1: {
    idMas: "S1",
    masLabelBasedOnCurrentLang: "Contact",
    rangeType: rangeType.RICH_TEXT,
    children: {
      "S1.1": {
        idMas: "S1.1",
        masLabelBasedOnCurrentLang: "Organisation",
        rangeType: rangeType.TEXT,
        children: {},
      },
    },
  },
  // Rubrique feuille de premier niveau : c'est la seule forme qui porte un titre.
  S2: {
    idMas: "S2",
    masLabelBasedOnCurrentLang: "Qualité",
    rangeType: rangeType.TEXT,
    children: {},
  },
} as any;

const rubrics = {
  S1: { idAttribute: "S1", rangeType: rangeType.RICH_TEXT },
  "S1.1": { idAttribute: "S1.1", rangeType: rangeType.TEXT },
  S2: { idAttribute: "S2", rangeType: rangeType.TEXT },
};

const onSubmit = vi.fn();

const renderCreation = (props: any = {}) =>
  render(
    <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{} as any}>
      <AdvancedSimsCreation
        mode="CREATE"
        idParent="op-1"
        sims={{ id: "sims-1", rubrics, updated: "2026-01-01" }}
        metadataStructure={metadataStructure}
        parentType="operation"
        onSubmit={onSubmit}
        organisations={[
          { id: "org-2", label: "Zèbre", labelLg2: "Zebra" },
          { id: "org-1", label: "Abeille", labelLg2: "Bee" },
        ]}
        {...props}
      />
    </AppContextProvider>,
  );

describe("AdvancedSimsCreation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    blocker.mockReturnValue({ state: "unblocked", reset: vi.fn(), proceed: vi.fn() });
    documentsStore.mockReturnValue({ lateralPanelOpened: false, onLateralPanelHide: vi.fn() });
    vi.mocked(OperationsApi.getOperationsWithReport).mockResolvedValue([]);
    vi.mocked(OperationsApi.getSeriesWithReport).mockResolvedValue([]);
    vi.mocked(OperationsApi.getIndicatorsListWithSims).mockResolvedValue([]);
  });

  it("rend un champ par rubrique de la structure, enfants compris", () => {
    renderCreation();

    expect(screen.getByText("champ:S1|lg1|seul:false")).toBeInTheDocument();
    expect(screen.getByText("champ:S1|lg2|seul:false")).toBeInTheDocument();
    expect(screen.getByText("champ:S1.1|lg1|seul:false")).toBeInTheDocument();
  });

  it("n'ouvre les documents que sur les rubriques en texte enrichi", () => {
    renderCreation();

    expect(screen.getByText("documents:S1|Lg1")).toBeInTheDocument();
    expect(screen.getByText("documents:S1|Lg2")).toBeInTheDocument();
    expect(screen.queryByText(/^documents:S1\.1/)).not.toBeInTheDocument();
  });

  it("ne titre que les rubriques feuilles de premier niveau", () => {
    renderCreation();

    expect(screen.getByRole("heading", { name: "S2 - Qualité" })).toBeInTheDocument();
    // S1 a des enfants : c'est une section, elle ne porte pas de titre.
    expect(screen.queryByRole("heading", { name: /^S1 / })).not.toBeInTheDocument();
  });

  it("enregistre le rapport puis revient sur sa fiche", async () => {
    onSubmit.mockImplementation((_payload, onSuccess) => onSuccess("sims-9"));
    renderCreation();

    await userEvent.click(screen.getByRole("button", { name: "enregistrer" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ id: "sims-1", idOperation: "op-1" }),
      expect.any(Function),
      expect.any(Function),
    );
    expect(goBack).toHaveBeenCalledWith("/operations/sims/sims-9", true);
  });

  it("sort de l'état d'enregistrement quand le serveur refuse", async () => {
    onSubmit.mockImplementation((_payload, _onSuccess, onError) => onError());
    renderCreation();

    await userEvent.click(screen.getByRole("button", { name: "enregistrer" }));

    expect(goBack).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "enregistrer" })).toBeInTheDocument();
  });

  it("reste en cours d'enregistrement tant que le serveur n'a pas répondu", async () => {
    onSubmit.mockImplementation(() => {});
    renderCreation();

    await userEvent.click(screen.getByRole("button", { name: "enregistrer" }));

    expect(screen.getByText(/Saving/i)).toBeInTheDocument();
  });

  it("propose la duplication d'un rapport existant, et bloque le choix dès qu'on a saisi", async () => {
    vi.mocked(OperationsApi.getOperationsWithReport).mockResolvedValue([
      { labelLg1: "Zèbre", idSims: "sims-z" },
      { labelLg1: "Abeille", idSims: "sims-a" },
    ] as any);
    renderCreation({ parent: { series: { id: "s-1" } } });

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /dupliquer:Abeille,Zèbre/ })).toBeEnabled(),
    );

    await userEvent.click(screen.getByText("champ:S1.1|lg1|seul:false"));

    expect(screen.getByRole("button", { name: /dupliquer:/ })).toBeDisabled();
  });

  it("recopie les rubriques du rapport choisi", async () => {
    vi.mocked(OperationsApi.getOperationsWithReport).mockResolvedValue([
      { labelLg1: "Abeille", idSims: "sims-a" },
    ] as any);
    // Le rapport recopié couvre toutes les rubriques de la structure : le composant lit
    // `sims[idMas].rangeType` sans garde.
    vi.mocked(getSiblingSims).mockResolvedValue({ ...rubrics } as any);
    renderCreation({ parent: { series: { id: "s-1" } } });
    await waitFor(() => expect(screen.getByRole("button", { name: /Abeille/ })).toBeEnabled());

    await userEvent.click(screen.getByRole("button", { name: /Abeille/ }));

    await waitFor(() => expect(getSiblingSims).toHaveBeenCalledWith("sims-a", metadataStructure));
    await waitFor(() => expect(screen.getByText("champ:S1|lg1|seul:false")).toBeInTheDocument());
  });

  it("charge les rapports frères d'une série depuis sa famille", async () => {
    renderCreation({ parentType: "series", parent: { family: { id: "f-1" } } });

    await waitFor(() => expect(OperationsApi.getSeriesWithReport).toHaveBeenCalledWith("f-1"));
    expect(OperationsApi.getOperationsWithReport).not.toHaveBeenCalled();
  });

  it("charge tous les indicateurs porteurs d'un rapport", async () => {
    renderCreation({ parentType: "indicator" });

    await waitFor(() => expect(OperationsApi.getIndicatorsListWithSims).toHaveBeenCalled());
  });

  it("ne charge aucun rapport frère quand le parent n'est pas résolu", async () => {
    renderCreation({ parentType: "operation", parent: undefined });

    await waitFor(() => expect(screen.getByText(/dupliquer:\(aucun\)/)).toBeInTheDocument());
    expect(OperationsApi.getOperationsWithReport).not.toHaveBeenCalled();
  });

  it("affiche l'erreur serveur, identifiant compris", () => {
    renderCreation({ error: { code: 409, details: "sims-1" } });

    expect(screen.getByText("errors.409sims-1")).toBeInTheDocument();
  });

  it("prévient avant de quitter la page avec des modifications non enregistrées", async () => {
    const proceed = vi.fn();
    const reset = vi.fn();
    blocker.mockReturnValue({ state: "blocked", proceed, reset });
    renderCreation();

    expect(screen.getByText("app.quitWithoutSaving")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "app.yes" }));
    expect(proceed).toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: "app.no" }));
    expect(reset).toHaveBeenCalled();
  });

  it("ne bloque la navigation que si l'on a saisi quelque chose et que l'on change de page", async () => {
    renderCreation();
    const predicate = blocker.mock.calls[0][0];

    expect(
      predicate({ currentLocation: { pathname: "/a" }, nextLocation: { pathname: "/b" } }),
    ).toBe(false);

    await userEvent.click(screen.getByText("champ:S1.1|lg1|seul:false"));
    const predicateAfterChange = blocker.mock.calls.at(-1)![0];

    expect(
      predicateAfterChange({
        currentLocation: { pathname: "/a" },
        nextLocation: { pathname: "/b" },
      }),
    ).toBe(true);
    expect(
      predicateAfterChange({
        currentLocation: { pathname: "/a" },
        nextLocation: { pathname: "/a" },
      }),
    ).toBe(false);
  });

  it("ajoute un document à la rubrique depuis le panneau latéral", async () => {
    documentsStore.mockReturnValue({ lateralPanelOpened: true, onLateralPanelHide: vi.fn() });
    onSubmit.mockImplementation(() => {});
    renderCreation();

    await userEvent.click(screen.getByRole("button", { name: "ajouter un document" }));
    await userEvent.click(screen.getByRole("button", { name: "enregistrer" }));

    const [payload] = onSubmit.mock.calls[0];
    expect(payload.rubrics).toContainEqual(
      expect.objectContaining({ idAttribute: "S1", documentsLg1: [{ id: "doc-1" }] }),
    );
  });

  it("retombe sur le parent quand le rapport n'a pas encore d'identifiant", () => {
    renderCreation({ sims: { rubrics, updated: "2026-01-01" } });

    expect(screen.getByText("retour:/operations/operation/op-1")).toBeInTheDocument();
  });
});
