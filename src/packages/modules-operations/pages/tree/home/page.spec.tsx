import { fireEvent, waitFor, within } from "@testing-library/react";

import { OperationsApi } from "@sdk/operations-api";

import { expectItemLoadFailed } from "../../../../tests/loading-error.testing";
import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
import { renderAtRoute } from "../../page.testing";
import { Component as OperationsTree } from "./page";

const mockGoBack = vi.fn();
vi.mock("@utils/hooks/useGoBack", () => ({
  useGoBack: () => mockGoBack,
}));

vi.mock("@utils/hooks/useTitle", () => ({
  useTitle: vi.fn(),
}));

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: {
    getAllFamilies: vi.fn(),
    getFamilyById: vi.fn(),
    getSerie: vi.fn(),
  },
}));

vi.mock("./tree.css", () => ({}));

// Le bouton de dépliage propre au nœud : le `:scope >` évite d'attraper celui d'un
// nœud enfant, qui est imbriqué dans le même <li role="treeitem">.
const togglerOf = (node: HTMLElement) =>
  node.querySelector<HTMLElement>(":scope > .p-treenode-content > .p-tree-toggler")!;

describe("OperationsTree", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(OperationsApi).getAllFamilies.mockResolvedValue([
      { id: "1", label: "Family 1" },
      { id: "2", labelLg1: "Family 2" },
    ]);
  });

  const renderTree = async () => {
    const utils = renderAtRoute(<OperationsTree />, "/operations/tree", "/operations/tree");
    await waitFor(() => {
      expect(utils.getByRole("treeitem", { name: "Family 1" })).toBeInTheDocument();
    });
    return utils;
  };

  // Famille 1 contenant la seule série « Series 1 ».
  const mockFamilyWithOneSeries = () =>
    vi.mocked(OperationsApi).getFamilyById.mockResolvedValue({
      series: [{ id: "s1", label: "Series 1" }],
    });

  const expandUntilSeriesShown = async (
    getByRole: Awaited<ReturnType<typeof renderTree>>["getByRole"],
    family = getByRole("treeitem", { name: "Family 1" }),
  ) => {
    fireEvent.click(togglerOf(family));
    await waitFor(() => {
      expect(getByRole("treeitem", { name: "Series 1" })).toBeInTheDocument();
    });
  };

  it("affiche un lien vers chaque famille chargée au montage", async () => {
    const { getByRole } = await renderTree();

    expect(vi.mocked(OperationsApi).getAllFamilies).toHaveBeenCalledTimes(1);
    expect(getByRole("link", { name: "Family 1" })).toHaveAttribute("href", "/operations/family/1");
    // La deuxième famille n'a pas de `label` : c'est `labelLg1` qui prend le relais.
    expect(getByRole("link", { name: "Family 2" })).toHaveAttribute("href", "/operations/family/2");
  });

  it("charge et affiche les séries d'une famille au dépliage", async () => {
    vi.mocked(OperationsApi).getFamilyById.mockResolvedValue({
      series: [
        { id: "s1", label: "Series 1" },
        { id: "s2", labelLg1: "Series 2" },
      ],
    });

    const { getByRole } = await renderTree();

    fireEvent.click(togglerOf(getByRole("treeitem", { name: "Family 2" })));

    await waitFor(() => {
      expect(getByRole("link", { name: "Series 1" })).toHaveAttribute(
        "href",
        "/operations/series/s1",
      );
    });
    expect(vi.mocked(OperationsApi).getFamilyById).toHaveBeenCalledWith("2");
    expect(getByRole("link", { name: "Series 2" })).toHaveAttribute(
      "href",
      "/operations/series/s2",
    );
  });

  it("charge et affiche les opérations d'une série au dépliage", async () => {
    mockFamilyWithOneSeries();
    vi.mocked(OperationsApi).getSerie.mockResolvedValue({
      operations: [
        { id: "o1", label: "Operation 1" },
        { id: "o2", labelLg1: "Operation 2" },
      ],
    });

    const { getByRole } = await renderTree();

    await expandUntilSeriesShown(getByRole);

    fireEvent.click(togglerOf(getByRole("treeitem", { name: "Series 1" })));

    await waitFor(() => {
      expect(getByRole("link", { name: "Operation 1" })).toHaveAttribute(
        "href",
        "/operations/operation/o1",
      );
    });
    expect(vi.mocked(OperationsApi).getSerie).toHaveBeenCalledWith("s1");
    expect(getByRole("link", { name: "Operation 2" })).toHaveAttribute(
      "href",
      "/operations/operation/o2",
    );
  });

  it("ne recharge pas les séries d'une famille déjà dépliée", async () => {
    mockFamilyWithOneSeries();

    const { getByRole } = await renderTree();
    const family = getByRole("treeitem", { name: "Family 1" });

    await expandUntilSeriesShown(getByRole, family);

    fireEvent.click(togglerOf(family)); // repli
    fireEvent.click(togglerOf(family)); // dépliage à nouveau

    await waitFor(() => {
      expect(getByRole("treeitem", { name: "Series 1" })).toBeInTheDocument();
    });
    expect(vi.mocked(OperationsApi).getFamilyById).toHaveBeenCalledTimes(1);
  });

  it("gère une famille sans série", async () => {
    vi.mocked(OperationsApi).getFamilyById.mockResolvedValue({});

    const { getByRole } = await renderTree();
    const family = getByRole("treeitem", { name: "Family 1" });

    fireEvent.click(togglerOf(family));

    await waitFor(() => {
      expect(vi.mocked(OperationsApi).getFamilyById).toHaveBeenCalledWith("1");
    });
    expect(within(family).queryAllByRole("treeitem")).toHaveLength(0);
  });

  it("gère une série sans opération", async () => {
    mockFamilyWithOneSeries();
    vi.mocked(OperationsApi).getSerie.mockResolvedValue({});

    const { getByRole } = await renderTree();

    await expandUntilSeriesShown(getByRole);

    const series = getByRole("treeitem", { name: "Series 1" });
    fireEvent.click(togglerOf(series));

    await waitFor(() => {
      expect(vi.mocked(OperationsApi).getSerie).toHaveBeenCalledWith("s1");
    });
    expect(within(series).queryAllByRole("treeitem")).toHaveLength(0);
  });

  it("signale le chargement tant que le dépliage n'est pas terminé", async () => {
    let resolveFamily: (value: { series: { id: string; label: string }[] }) => void;
    vi.mocked(OperationsApi).getFamilyById.mockReturnValue(
      new Promise((resolve) => {
        resolveFamily = resolve;
      }),
    );

    const { getByRole, container } = await renderTree();

    expect(container.querySelector(".p-tree-loading")).not.toBeInTheDocument();

    fireEvent.click(togglerOf(getByRole("treeitem", { name: "Family 1" })));

    await waitFor(() => {
      expect(container.querySelector(".p-tree-loading")).toBeInTheDocument();
    });

    resolveFamily!({ series: [{ id: "s1", label: "Series 1" }] });

    await waitFor(() => {
      expect(container.querySelector(".p-tree-loading")).not.toBeInTheDocument();
    });
  });

  it("affiche l'échec de chargement des familles au lieu d'un arbre vide", async () => {
    vi.mocked(OperationsApi).getAllFamilies.mockRejectedValue(sdkRejection.emptyBody(500));
    const { queryByRole } = renderAtRoute(
      <OperationsTree />,
      "/operations/tree",
      "/operations/tree",
    );

    await expectItemLoadFailed();
    expect(queryByRole("tree")).not.toBeInTheDocument();
  });

  it("affiche l'échec du dépliage d'une famille et cesse de signaler le chargement", async () => {
    vi.mocked(OperationsApi).getFamilyById.mockRejectedValue(sdkRejection.emptyBody(500));

    const { getByRole, container } = await renderTree();

    fireEvent.click(togglerOf(getByRole("treeitem", { name: "Family 1" })));

    await expectItemLoadFailed();
    expect(container.querySelector(".p-tree-loading")).not.toBeInTheDocument();
    expect(getByRole("treeitem", { name: "Family 1" })).toBeInTheDocument();
  });

  it("affiche l'échec du dépliage d'une série", async () => {
    mockFamilyWithOneSeries();
    vi.mocked(OperationsApi).getSerie.mockRejectedValue(sdkRejection.emptyBody(500));

    const { getByRole } = await renderTree();

    await expandUntilSeriesShown(getByRole);
    fireEvent.click(togglerOf(getByRole("treeitem", { name: "Series 1" })));

    await expectItemLoadFailed();
  });

  it("revient à l'accueil des opérations", async () => {
    const { getByRole } = await renderTree();

    fireEvent.click(getByRole("button", { name: /back/i }));

    expect(mockGoBack).toHaveBeenCalledWith("/operations");
  });
});
