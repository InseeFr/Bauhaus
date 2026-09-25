import { render, screen, within } from "@testing-library/react";
import { vi } from "vitest";

import { Component, ComponentDefinition } from "@model/structures/Component";
import { Structure } from "@model/structures/Structure";
import { UNPUBLISHED } from "@model/ValidationState";

import { StructureApi } from "@sdk/index";

import {
  ATTRIBUTE_PROPERTY_TYPE,
  DIMENSION_PROPERTY_TYPE,
  MEASURE_PROPERTY_TYPE,
} from "../constants";
import { clickIcon, createStructuresWrapper, rowOf } from "../render.testing";
import { ComponentSelector } from "./ComponentSelector";

vi.mock("@sdk/index", async () => ({
  ...(await import("../mocks.testing")).emptyCodelistsAndStampsApi(),
  StructureApi: {
    getMutualizedComponent: vi.fn(),
  },
}));

vi.mock("@utils/hooks/users", async (importOriginal) =>
  (await import("../mocks.testing")).usersHookWithCreatePrivilege(
    await importOriginal(),
    "STRUCTURE_COMPONENT",
  ),
);

const component = (identifiant: string, type = DIMENSION_PROPERTY_TYPE): Component => ({
  id: identifiant,
  identifiant,
  labelLg1: `Composante ${identifiant}`,
  type,
  validationState: UNPUBLISHED,
  contributor: [],
  structures: [],
});

const definition = (
  identifiant: string,
  order: number,
  type = DIMENSION_PROPERTY_TYPE,
): ComponentDefinition => ({
  order,
  component: component(identifiant, type),
});

const Wrapper = createStructuresWrapper();

const handleUpdate = vi.fn();

const renderSelector = (props: Record<string, unknown> = {}) =>
  render(
    <ComponentSelector
      structure={{} as Structure}
      componentDefinitions={[definition("d1", 1), definition("d2", 2)]}
      mutualizedComponents={[component("m1"), component("d1")]}
      concepts={[]}
      codelists={[]}
      handleUpdate={handleUpdate}
      type={DIMENSION_PROPERTY_TYPE}
      {...props}
    />,
    { wrapper: Wrapper },
  );

/** Vérifie que la structure est mise à jour avec les composantes `ids`, dans cet ordre. */
const expectUpdatedOrder = (...ids: string[]) =>
  expect(handleUpdate).toHaveBeenCalledWith(
    ids.map((id, index) =>
      expect.objectContaining({ order: index + 1, component: expect.objectContaining({ id }) }),
    ),
  );

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

    expectUpdatedOrder("d1", "d2", "m1");
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

    expectUpdatedOrder("d1", "d3");
  });

  it("intervertit deux composantes quand on en descend une", () => {
    renderSelector({ mutualizedComponents: [] });

    clickIcon(within(rowOf("d1")).getByLabelText("Down"));

    expectUpdatedOrder("d2", "d1");
  });

  it("intervertit deux composantes quand on en monte une", () => {
    renderSelector({ mutualizedComponents: [] });

    clickIcon(within(rowOf("d2")).getByLabelText("Up"));

    expectUpdatedOrder("d2", "d1");
  });
});
