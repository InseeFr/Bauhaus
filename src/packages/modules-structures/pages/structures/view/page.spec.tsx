import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { Structure } from "@model/structures/Structure";

import { StructureApi } from "@sdk/index";

import { MODULES, PRIVILEGES, STRATEGIES } from "@utils/hooks/rbac-constants";

import { expectItemLoadFailed, expectItemNotFound } from "../../../../tests/loading-error.testing";
import { mockReactQueryForRbac, renderWithAppContext } from "../../../../tests/render";
import { sdkRejection } from "../../../../tests/sdk-rejection.testing";

const navigate = vi.fn();

vi.mock("react-router", async () => ({
  ...(await vi.importActual("react-router")),
  useParams: () => ({ id: "1" }),
  useNavigate: () => navigate,
}));

vi.mock("@sdk/index", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@sdk/index")>()),
  StructureApi: { getStructure: vi.fn(), deleteStructure: vi.fn() },
}));

vi.mock("./components/GlobalInformationsPanel", () => ({
  GlobalInformationsPanel: vi.fn(() => <div></div>),
}));

vi.mock("./components/DescriptionsPanel", () => ({
  DescriptionsPanel: vi.fn(() => <div></div>),
}));

vi.mock("./components/ComponentsPanel", () => ({
  ComponentsPanel: vi.fn(() => <div></div>),
}));

describe("<StructureView />", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });
  it("should display labelLg1", async () => {
    mockReactQueryForRbac([]);
    const { StructureView } = await import("./page");

    const { container } = renderWithAppContext(
      <StructureView
        publish={vi.fn()}
        onDeleteError={vi.fn()}
        structure={
          {
            labelLg1: "labelLg1",
          } as Structure
        }
      ></StructureView>,
    );

    expect(container.querySelector("h2")!.innerHTML).toEqual("labelLg1");
  });
});

describe("Structure view page", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("indique que la structure est introuvable au lieu d'une page vide", async () => {
    mockReactQueryForRbac([]);
    vi.mocked(StructureApi.getStructure).mockRejectedValue(sdkRejection.emptyBody(404));
    const { Component } = await import("./page");

    renderWithAppContext(<Component />);

    await expectItemNotFound();
    expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
  });

  it("indique que la structure n'a pas pu être chargée", async () => {
    mockReactQueryForRbac([]);
    vi.mocked(StructureApi.getStructure).mockRejectedValue(sdkRejection.emptyBody(500));
    const { Component } = await import("./page");

    renderWithAppContext(<Component />);

    await expectItemLoadFailed();
  });

  it("reste sur la fiche et affiche l'erreur quand la suppression échoue", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.STRUCTURE_STRUCTURE,
        privileges: [{ privilege: PRIVILEGES.DELETE, strategy: STRATEGIES.ALL }],
      },
    ]);
    vi.mocked(StructureApi.getStructure).mockResolvedValue({
      id: "1",
      labelLg1: "Structure FR",
      validationState: "Unpublished",
    } as Structure);
    vi.mocked(StructureApi.deleteStructure).mockRejectedValue(
      sdkRejection.text(500, "Suppression impossible"),
    );
    const { Component } = await import("./page");
    // Même registre de modules que la page : le contexte applicatif doit être le sien.
    const { renderWithAppContext: render } = await import("../../../../tests/render");

    render(<Component />);
    await userEvent.click(await screen.findByRole("button", { name: /delete/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Suppression impossible");
    expect(navigate).not.toHaveBeenCalled();
    expect(screen.getByText("Structure FR")).toBeInTheDocument();
  });

  it("revient à la liste des structures quand la suppression réussit", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.STRUCTURE_STRUCTURE,
        privileges: [{ privilege: PRIVILEGES.DELETE, strategy: STRATEGIES.ALL }],
      },
    ]);
    vi.mocked(StructureApi.getStructure).mockResolvedValue({
      id: "1",
      labelLg1: "Structure FR",
      validationState: "Unpublished",
    } as Structure);
    vi.mocked(StructureApi.deleteStructure).mockResolvedValue("");
    const { Component } = await import("./page");
    // Même registre de modules que la page : le contexte applicatif doit être le sien.
    const { renderWithAppContext: render } = await import("../../../../tests/render");

    render(<Component />);
    await userEvent.click(await screen.findByRole("button", { name: /delete/i }));

    await waitFor(() => expect(navigate).toHaveBeenCalledWith("/structures"));
    expect(StructureApi.deleteStructure).toHaveBeenCalledWith("1");
  });
});
