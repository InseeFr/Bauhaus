import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { StructureApi } from "@sdk/index";

import { AppContextProvider } from "../../application/app-context";
import {
  ATTRIBUTE_PROPERTY_TYPE,
  DIMENSION_PROPERTY_TYPE,
  MEASURE_PROPERTY_TYPE,
} from "../constants";
import { ComponentSelector } from "./ComponentSelector";

vi.mock("@sdk/index", () => ({
  CodelistsApi: {
    getCodelistsPartial: vi.fn().mockResolvedValue([]),
    getPartialsByParent: vi.fn().mockResolvedValue([]),
  },
  StructureApi: {
    getMutualizedComponent: vi.fn(),
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

const component = (identifiant: string, type = DIMENSION_PROPERTY_TYPE) => ({
  id: identifiant,
  identifiant,
  labelLg1: `Composante ${identifiant}`,
  type,
  validationState: "Unpublished",
});

const definition = (identifiant: string, order: number, type = DIMENSION_PROPERTY_TYPE) => ({
  order,
  component: component(identifiant, type),
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

const handleUpdate = vi.fn();

const renderSelector = (props: Record<string, unknown> = {}) =>
  render(
    <ComponentSelector
      structure={{}}
      componentDefinitions={[definition("d1", 1), definition("d2", 2)]}
      mutualizedComponents={[component("m1"), component("d1")]}
      concepts={[]}
      codesLists={[]}
      handleUpdate={handleUpdate}
      type={DIMENSION_PROPERTY_TYPE}
      {...props}
    />,
    { wrapper: Wrapper },
  );

/** Les gestionnaires lisent `dataset.componentId` sur le parent de la cible : on clique l'icône. */
const clickIcon = (button: HTMLElement) =>
  fireEvent.click(button.querySelector("span, svg") ?? button);

const rowOf = (identifiant: string) =>
  screen.getByText(`Composante ${identifiant}`).closest("tr") as HTMLElement;

describe("ComponentSelector", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("n'affiche que les composantes de la structure du type demandé", () => {
    renderSelector({
      componentDefinitions: [definition("d1", 1), definition("m1", 1, MEASURE_PROPERTY_TYPE)],
    });

    expect(screen.getByText("Composante d1")).toBeInTheDocument();
    expect(screen.queryByText("Composante m1")).toBeNull();
  });

  it("ne propose à l'ajout que les composantes mutualisées absentes de la structure", () => {
    renderSelector();

    // « d1 » est déjà dans la structure : seule « m1 » reste proposée.
    expect(screen.getAllByText("Composante d1")).toHaveLength(1);
    expect(screen.getByText("Composante m1")).toBeInTheDocument();
  });

  it("ajoute une composante mutualisée à la fin de son type", () => {
    renderSelector();

    clickIcon(within(rowOf("m1")).getByLabelText("Add"));

    expect(handleUpdate).toHaveBeenCalledWith([
      expect.objectContaining({ order: 1, component: expect.objectContaining({ id: "d1" }) }),
      expect.objectContaining({ order: 2, component: expect.objectContaining({ id: "d2" }) }),
      expect.objectContaining({ order: 3, component: expect.objectContaining({ id: "m1" }) }),
    ]);
  });

  it("rattache un attribut ajouté seul à l'observation", () => {
    renderSelector({
      componentDefinitions: [],
      mutualizedComponents: [component("a1", ATTRIBUTE_PROPERTY_TYPE)],
      type: ATTRIBUTE_PROPERTY_TYPE,
    });

    clickIcon(within(rowOf("a1")).getByLabelText("Add"));

    expect(handleUpdate).toHaveBeenCalledWith([
      expect.objectContaining({
        order: 1,
        attachment: ["http://purl.org/linked-data/cube#Observation"],
      }),
    ]);
  });

  it("ajoute les attributs liés à une mesure mutualisée", async () => {
    vi.mocked(StructureApi.getMutualizedComponent).mockResolvedValue({
      id: "mes1",
      attribute_1: "iri-a1",
    });
    const attribute = { ...component("a1", ATTRIBUTE_PROPERTY_TYPE), iri: "iri-a1" };
    renderSelector({
      componentDefinitions: [],
      mutualizedComponents: [component("mes1", MEASURE_PROPERTY_TYPE), attribute],
      type: MEASURE_PROPERTY_TYPE,
    });

    clickIcon(within(rowOf("mes1")).getByLabelText("Add"));

    await vi.waitFor(() =>
      expect(handleUpdate).toHaveBeenCalledWith([
        expect.objectContaining({ order: 1, component: expect.objectContaining({ id: "mes1" }) }),
        expect.objectContaining({
          order: 2,
          attachment: ["mes1"],
          component: expect.objectContaining({ id: "a1" }),
        }),
      ]),
    );
  });

  it("retire une composante et renumérote les suivantes", () => {
    renderSelector({
      componentDefinitions: [definition("d1", 1), definition("d2", 2), definition("d3", 3)],
      mutualizedComponents: [],
    });

    clickIcon(within(rowOf("d2")).getByLabelText("Remove"));

    expect(handleUpdate).toHaveBeenCalledWith([
      expect.objectContaining({ order: 1, component: expect.objectContaining({ id: "d1" }) }),
      expect.objectContaining({ order: 2, component: expect.objectContaining({ id: "d3" }) }),
    ]);
  });

  it("intervertit deux composantes quand on en descend une", () => {
    renderSelector({
      componentDefinitions: [definition("d1", 1), definition("d2", 2)],
      mutualizedComponents: [],
    });

    clickIcon(within(rowOf("d1")).getByLabelText("Down"));

    expect(handleUpdate).toHaveBeenCalledWith([
      expect.objectContaining({ order: 1, component: expect.objectContaining({ id: "d2" }) }),
      expect.objectContaining({ order: 2, component: expect.objectContaining({ id: "d1" }) }),
    ]);
  });

  it("intervertit deux composantes quand on en monte une", () => {
    renderSelector({
      componentDefinitions: [definition("d1", 1), definition("d2", 2)],
      mutualizedComponents: [],
    });

    clickIcon(within(rowOf("d2")).getByLabelText("Up"));

    expect(handleUpdate).toHaveBeenCalledWith([
      expect.objectContaining({ order: 1, component: expect.objectContaining({ id: "d2" }) }),
      expect.objectContaining({ order: 2, component: expect.objectContaining({ id: "d1" }) }),
    ]);
  });
});
