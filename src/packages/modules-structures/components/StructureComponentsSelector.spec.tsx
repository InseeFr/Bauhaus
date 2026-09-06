import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { AppContextProvider } from "../../application/app-context";
import { StructureComponentsSelector } from "./StructureComponentsSelector";

vi.mock("@sdk/index", () => ({
  CodelistsApi: {
    getCodelistsPartial: vi.fn().mockResolvedValue([]),
    getPartialsByParent: vi.fn().mockResolvedValue([]),
  },
  StructureApi: {
    getMutualizedComponents: vi.fn().mockResolvedValue([]),
  },
  StampsApi: { getStamps: vi.fn().mockResolvedValue([]) },
}));

vi.mock("@utils/hooks/users", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@utils/hooks/users")>();
  return {
    ...actual,
    usePrivileges: () => ({
      privileges: [
        {
          application: "STRUCTURE_COMPONENT",
          privileges: [{ privilege: "CREATE", strategy: "ALL" }],
        },
      ],
    }),
    useUserStamps: () => ({ data: [{ stamp: "DG75-L201" }] }),
  };
});

const componentDefinition = (
  identifiant: string,
  order: number,
  overrides: Record<string, unknown> = {},
): any => ({
  id: `cd-${identifiant}`,
  order,
  component: {
    id: identifiant,
    identifiant,
    labelLg1: `Composante ${identifiant}`,
    type: "http://purl.org/linked-data/cube#DimensionProperty",
    concept: identifiant,
    validationState: "Unpublished",
    ...overrides,
  },
});

const Wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    <MemoryRouter>
      <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{} as any}>
        {children}
      </AppContextProvider>
    </MemoryRouter>
  </QueryClientProvider>
);

const defaultProps = {
  componentDefinitions: [componentDefinition("c1", 1), componentDefinition("c2", 2)],
  concepts: [
    { id: "c1", label: "Concept 1" },
    { id: "c2", label: "Concept 2" },
  ],
  codesLists: [],
  readOnly: false,
  handleRemove: vi.fn(),
  handleUp: vi.fn(),
  handleDown: vi.fn(),
  handleCreateOrUpdate: vi.fn(),
  handleSpecificationClick: vi.fn(),
  handleCodesListDetail: vi.fn(),
};

const renderSelector = (props: Record<string, unknown> = {}) =>
  render(<StructureComponentsSelector {...defaultProps} {...props} />, { wrapper: Wrapper });

/** Les gestionnaires lisent `dataset.componentId` sur le parent de la cible : on clique l'icône. */
const clickIcon = (button: HTMLElement) => fireEvent.click(button.querySelector("span")!);

const rowOf = (identifiant: string) =>
  screen.getByText(`Composante ${identifiant}`).closest("tr") as HTMLElement;

describe("StructureComponentsSelector", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("liste les composantes avec leur concept", () => {
    renderSelector();

    expect(screen.getByText("Composante c1")).toBeInTheDocument();
    expect(screen.getByText("Concept 1")).toBeInTheDocument();
  });

  it("ordonne les composantes par leur ordre déclaré", () => {
    renderSelector({
      componentDefinitions: [componentDefinition("c2", 2), componentDefinition("c1", 1)],
    });

    const labels = screen.getAllByText(/^Composante /).map((element) => element.textContent);
    expect(labels).toEqual(["Composante c1", "Composante c2"]);
  });

  it("signale les composantes mutualisées", () => {
    renderSelector({
      componentDefinitions: [
        componentDefinition("c1", 1, { validationState: "Validated" }),
        componentDefinition("c2", 2),
      ],
    });

    expect(within(rowOf("c1")).getByLabelText("Published")).toBeInTheDocument();
    expect(within(rowOf("c2")).queryByLabelText("Published")).toBeNull();
  });

  it("supprime la composante dont on clique le bouton de retrait", () => {
    renderSelector();

    clickIcon(within(rowOf("c1")).getByLabelText("Remove"));

    expect(defaultProps.handleRemove).toHaveBeenCalledWith("c1");
  });

  it("remonte et descend une composante", () => {
    renderSelector();

    clickIcon(within(rowOf("c2")).getByLabelText("Up"));
    clickIcon(within(rowOf("c1")).getByLabelText("Down"));

    expect(defaultProps.handleUp).toHaveBeenCalledWith("c2");
    expect(defaultProps.handleDown).toHaveBeenCalledWith("c1");
  });

  it("n'offre pas de monter la première composante ni de descendre la dernière", () => {
    renderSelector();

    expect(within(rowOf("c1")).queryByLabelText("Up")).toBeNull();
    expect(within(rowOf("c2")).queryByLabelText("Down")).toBeNull();
  });

  it("ouvre la spécification de la composante", () => {
    renderSelector();

    clickIcon(within(rowOf("c1")).getByLabelText("Component specification"));

    expect(defaultProps.handleSpecificationClick).toHaveBeenCalledWith(
      expect.objectContaining({ component: expect.objectContaining({ identifiant: "c1" }) }),
    );
  });

  it("masque les actions d'édition en lecture seule", () => {
    renderSelector({ readOnly: true });

    expect(screen.queryByLabelText("Remove")).toBeNull();
    expect(screen.queryByLabelText("Up")).toBeNull();
    expect(screen.queryByLabelText("Down")).toBeNull();
    expect(screen.queryByRole("button", { name: "Add" })).toBeNull();
  });

  it("ouvre le détail de la composante dont on clique le bouton de consultation", async () => {
    renderSelector();

    clickIcon(within(rowOf("c1")).getByLabelText("See"));

    const panel = await screen.findByRole("complementary");
    expect(within(panel).getByText("Composante c1")).toBeInTheDocument();
  });

  it("ouvre le formulaire de création avec le statut de diffusion de la structure", async () => {
    renderSelector({ structure: { disseminationStatus: "http://bauhaus/statut/Public" } });

    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    const panel = await screen.findByRole("complementary");
    expect(within(panel).getByRole("textbox", { name: /label/i })).toBeInTheDocument();
  });

  it("ajoute la composante créée à la fin de la liste", async () => {
    renderSelector({ type: "http://purl.org/linked-data/cube#DimensionProperty" });

    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    const panel = await screen.findByRole("complementary");
    fireEvent.change(within(panel).getByLabelText(/^Notation/), {
      target: { name: "identifiant", value: "c3" },
    });
    fireEvent.change(within(panel).getByLabelText(/^Libellé/), {
      target: { name: "labelLg1", value: "Composante c3" },
    });
    fireEvent.change(within(panel).getByLabelText(/^Label/), {
      target: { name: "labelLg2", value: "Component c3" },
    });
    fireEvent.click(within(panel).getByRole("button", { name: "Save" }));

    expect(defaultProps.handleCreateOrUpdate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          order: 3,
          component: expect.objectContaining({ identifiant: "c3", labelLg1: "Composante c3" }),
        }),
      ]),
      true,
      expect.objectContaining({ order: 3 }),
    );
  });

  it("refuse d'enregistrer une composante incomplète", async () => {
    renderSelector({ type: "http://purl.org/linked-data/cube#DimensionProperty" });

    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    const panel = await screen.findByRole("complementary");
    fireEvent.click(within(panel).getByRole("button", { name: "Save" }));

    expect(defaultProps.handleCreateOrUpdate).not.toHaveBeenCalled();
    expect(within(panel).getByRole("alert")).toBeInTheDocument();
  });

  it("prend en compte une nouvelle liste de composantes", () => {
    const { rerender } = renderSelector();

    rerender(
      <StructureComponentsSelector
        {...defaultProps}
        componentDefinitions={[componentDefinition("c3", 1)]}
      />,
    );

    expect(screen.getByText("Composante c3")).toBeInTheDocument();
    expect(screen.queryByText("Composante c1")).toBeNull();
  });
});
