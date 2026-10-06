import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { ReactNode } from "react";

import { Operation } from "@model/Operation";

import { OperationsApi } from "@sdk/operations-api";

import { renderWithAppContext } from "../../../../../tests/render";
import { OperationsOperationEdition } from "./OperationsOperationEdition";

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: {
    getUserSeriesList: vi.fn(),
    postOperation: vi.fn(),
    putOperation: vi.fn(),
  },
}));

const existingOperation = {
  id: "123",
  prefLabelLg1: "Recensement",
  prefLabelLg2: "Census",
  altLabelLg1: "",
  altLabelLg2: "",
  year: "2024",
  series: { id: "s1" },
} as unknown as Operation;

const renderEdition = (
  operation: Partial<Operation>,
  goBack = vi.fn(),
  queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } }),
) => {
  const wrap = (node: ReactNode) => (
    <QueryClientProvider client={queryClient}>{node}</QueryClientProvider>
  );
  const utils = renderWithAppContext(
    wrap(<OperationsOperationEdition id={operation.id} operation={operation} goBack={goBack} />),
  );
  return {
    ...utils,
    goBack,
    rerenderWith: (next: Partial<Operation>) =>
      utils.rerender(
        wrap(<OperationsOperationEdition id={next.id} operation={next} goBack={goBack} />),
      ),
  };
};

const titleLg1 = () => screen.getByLabelText(/Intitulé|Title/, { selector: "#prefLabelLg1" });
const titleLg2 = () => screen.getByLabelText(/Intitulé|Title/, { selector: "#prefLabelLg2" });
const save = () => fireEvent.click(screen.getByRole("button", { name: /Sauvegarder|Save/ }));

describe("OperationsOperationEdition", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(OperationsApi).getUserSeriesList.mockResolvedValue([
      { id: "s1", label: "Série 1", altLabel: "" },
      { id: "s2", label: "Série 2", altLabel: "" },
    ]);
  });

  it("enregistre l'opération modifiée puis revient sur sa fiche", async () => {
    vi.mocked(OperationsApi).putOperation.mockResolvedValue(undefined);
    const { goBack } = renderEdition(existingOperation);

    fireEvent.change(titleLg1(), { target: { value: "Recensement 2025" } });
    save();

    await waitFor(() => {
      expect(vi.mocked(OperationsApi).putOperation).toHaveBeenCalledWith(
        expect.objectContaining({ id: "123", prefLabelLg1: "Recensement 2025" }),
      );
    });
    await waitFor(() => expect(goBack).toHaveBeenCalledWith("/operations/operation/123", false));
  });

  it("périme les séries en cache, dont la fiche liste les opérations", async () => {
    vi.mocked(OperationsApi).putOperation.mockResolvedValue(undefined);
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    queryClient.setQueryData(["series", "s1"], { id: "s1" });
    let invalidatedAtGoBack: boolean | undefined;
    const goBack = vi.fn(() => {
      invalidatedAtGoBack = queryClient.getQueryState(["series", "s1"])?.isInvalidated;
    });
    renderEdition(existingOperation, goBack, queryClient);

    save();

    await waitFor(() => expect(goBack).toHaveBeenCalled());
    expect(invalidatedAtGoBack).toBe(true);
  });

  it("périme l'opération en cache avant de revenir sur sa fiche", async () => {
    vi.mocked(OperationsApi).putOperation.mockResolvedValue(undefined);
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    queryClient.setQueryData(["operations", "123"], { id: "123" });
    let invalidatedAtGoBack: boolean | undefined;
    const goBack = vi.fn(() => {
      invalidatedAtGoBack = queryClient.getQueryState(["operations", "123"])?.isInvalidated;
    });
    renderEdition(existingOperation, goBack, queryClient);

    save();

    await waitFor(() => expect(goBack).toHaveBeenCalled());
    expect(invalidatedAtGoBack).toBe(true);
  });

  it("ne réaffiche pas le formulaire pendant le retour sur la fiche après l'enregistrement", async () => {
    // La navigation de goBack est asynchrone (navigate(-1), route chargée à la demande) : tant
    // qu'elle n'a pas abouti, le composant reste monté et ne doit pas repasser sur le formulaire.
    vi.mocked(OperationsApi).putOperation.mockResolvedValue(undefined);
    const { goBack } = renderEdition(existingOperation);

    save();

    await waitFor(() => expect(goBack).toHaveBeenCalled());
    await act(async () => {});
    expect(screen.queryByRole("button", { name: /Sauvegarder|Save/ })).not.toBeInTheDocument();
  });

  it("enregistre l'année saisie", async () => {
    vi.mocked(OperationsApi).putOperation.mockResolvedValue(undefined);
    renderEdition(existingOperation);

    fireEvent.change(screen.getByLabelText(/Année|Year/), { target: { value: "2025" } });
    save();

    await waitFor(() => {
      expect(vi.mocked(OperationsApi).putOperation).toHaveBeenCalledWith(
        expect.objectContaining({ year: "2025" }),
      );
    });
  });

  it("crée l'opération rattachée à la série choisie puis ouvre la fiche créée", async () => {
    vi.mocked(OperationsApi).postOperation.mockResolvedValue("456");
    const { goBack } = renderEdition({});

    await waitFor(() => {
      expect(vi.mocked(OperationsApi).getUserSeriesList).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(await screen.findByText("Série 2"));

    fireEvent.change(titleLg1(), { target: { value: "Nouvelle opération" } });
    fireEvent.change(titleLg2(), { target: { value: "New operation" } });
    save();

    await waitFor(() => {
      expect(vi.mocked(OperationsApi).postOperation).toHaveBeenCalledWith(
        expect.objectContaining({
          prefLabelLg1: "Nouvelle opération",
          prefLabelLg2: "New operation",
          series: { id: "s2" },
        }),
      );
    });
    await waitFor(() => expect(goBack).toHaveBeenCalledWith("/operations/operation/456", true));
  });

  it("refuse d'enregistrer une opération incomplète et affiche ce qui manque", () => {
    renderEdition({});

    save();

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(vi.mocked(OperationsApi).postOperation).not.toHaveBeenCalled();
    expect(vi.mocked(OperationsApi).putOperation).not.toHaveBeenCalled();
  });

  it("affiche l'erreur remontée par le serveur et laisse le formulaire en place", async () => {
    vi.mocked(OperationsApi).putOperation.mockRejectedValue("Conflit de version");
    renderEdition(existingOperation);

    save();

    expect(await screen.findByText("Conflit de version")).toBeInTheDocument();
    expect(titleLg1()).toHaveValue("Recensement");
  });

  it("affiche une erreur de validation du serveur sous le champ concerné", async () => {
    vi.mocked(OperationsApi).putOperation.mockRejectedValue({
      status: 400,
      errors: [{ field: "prefLabelLg1", message: "prefLabelLg1 is required" }],
    });
    renderEdition(existingOperation);

    save();

    await waitFor(() => expect(titleLg1()).toHaveAccessibleDescription("prefLabelLg1 is required"));
    expect(titleLg1()).toHaveAttribute("aria-invalid", "true");
  });

  it("affiche sous l'année l'erreur du serveur sur l'année", async () => {
    vi.mocked(OperationsApi).putOperation.mockRejectedValue({
      status: 400,
      errors: [{ field: "year", message: "must be an integer" }],
    });
    renderEdition(existingOperation);

    save();

    await waitFor(() =>
      expect(screen.getByLabelText(/Année|Year/)).toHaveAccessibleDescription("must be an integer"),
    );
  });

  it("affiche sous la série l'erreur du serveur sur la série, en création", async () => {
    vi.mocked(OperationsApi).postOperation.mockRejectedValue({
      status: 400,
      errors: [{ field: "series.id", message: "series.id is required" }],
    });
    renderEdition({});
    await waitFor(() => expect(vi.mocked(OperationsApi).getUserSeriesList).toHaveBeenCalled());
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(await screen.findByText("Série 2"));
    fireEvent.change(titleLg1(), { target: { value: "Nouvelle opération" } });
    fireEvent.change(titleLg2(), { target: { value: "New operation" } });

    save();

    expect(await screen.findByText("series.id is required")).toHaveAttribute("id", "series-error");
  });

  it("n'affiche pas d'erreur générique quand toutes les erreurs du serveur sont sous leur champ", async () => {
    vi.mocked(OperationsApi).putOperation.mockRejectedValue({
      status: 400,
      errors: [{ field: "prefLabelLg1", message: "prefLabelLg1 is required" }],
    });
    renderEdition(existingOperation);

    save();

    await waitFor(() => expect(titleLg1()).toHaveAccessibleDescription("prefLabelLg1 is required"));
    expect(screen.queryByText(/An error has occurred|Une erreur s'est produite/)).toBeNull();
  });

  it("affiche dans le bandeau une erreur du serveur sur un champ absent du formulaire", async () => {
    vi.mocked(OperationsApi).putOperation.mockRejectedValue({
      status: 400,
      errors: [{ field: "created", message: "is not a valid LocalDate" }],
    });
    renderEdition(existingOperation);

    save();

    expect(await screen.findByText("created : is not a valid LocalDate")).toBeInTheDocument();
  });

  it("repart des données de l'opération quand la page en charge une autre", () => {
    const { rerenderWith } = renderEdition(existingOperation);

    fireEvent.change(titleLg1(), { target: { value: "Saisie en cours" } });
    rerenderWith({ ...existingOperation, id: "789", prefLabelLg1: "Enquête emploi" });

    expect(titleLg1()).toHaveValue("Enquête emploi");
  });
});
