import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter, Route, Routes } from "react-router";

import { DDIApi } from "@sdk/ddi-api";

import type { AppName } from "../../../../../application/app-context";
import { testsI18n } from "../../../../../tests/i18n";
import { createQueryWrapper } from "../../../../hooks/queryClientWrapper.testing";
import { CreateOperationPhysicalInstance } from "./CreateOperationPhysicalInstance";

vi.mock("@sdk/ddi-api", () => ({
  DDIApi: { getOperationStudyUnits: vi.fn(), postPhysicalInstance: vi.fn() },
}));

let mockVisibleModules: AppName[] = [];
vi.mock("../../../../../application/visible-modules", () => ({
  useVisibleModules: () => mockVisibleModules,
}));

let mockCreateStrategy: string | undefined;
vi.mock("@utils/hooks/users", () => ({
  usePrivileges: () => ({
    isPending: false,
    privileges: mockCreateStrategy
      ? [
          {
            application: "DDI_PHYSICALINSTANCE",
            privileges: [{ privilege: "CREATE", strategy: mockCreateStrategy }],
          },
        ]
      : [],
  }),
}));

const studyUnit = (id: string, label: string) => ({
  studyUnit: { agency: "fr.insee", id, label },
  group: { agency: "fr.insee", id: "grp-1", label: "Enquête emploi" },
});

const renderButton = () => {
  const { wrapper: QueryWrapper } = createQueryWrapper();
  return render(
    <QueryWrapper>
      <I18nextProvider i18n={testsI18n}>
        <MemoryRouter initialEntries={["/operations/operation/s1268"]}>
          <Routes>
            <Route
              path="/operations/operation/:id"
              element={<CreateOperationPhysicalInstance operationId="s1268" />}
            />
            <Route path="/ddi/physical-instances/:agency/:id" element={<p>page de la PI</p>} />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    </QueryWrapper>,
  );
};

const newButton = () =>
  screen.findByRole("button", { name: testsI18n.t("operationPhysicalInstance.new") });

const fillLabelAndSubmit = async (label: string) => {
  await userEvent.type(
    screen.getByLabelText(testsI18n.t("operationPhysicalInstance.label")),
    label,
  );
  await userEvent.click(
    screen.getByRole("button", { name: testsI18n.t("operationPhysicalInstance.create") }),
  );
};

describe("CreateOperationPhysicalInstance", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockVisibleModules = ["operations", "ddi"];
    mockCreateStrategy = "ALL";
    vi.mocked(DDIApi.postPhysicalInstance).mockResolvedValue({
      topLevelReferences: [{ $type: "PhysicalInstance", Agency: "fr.insee", ID: "pi-new" }],
    });
  });

  it("crée le fichier dans l'étude de l'opération et sa série, puis ouvre sa page", async () => {
    vi.mocked(DDIApi.getOperationStudyUnits).mockResolvedValue([studyUnit("su-1", "Alpha")]);

    renderButton();
    await userEvent.click(await newButton());
    await fillLabelAndSubmit("Individus");

    await screen.findByText("page de la PI");
    expect(DDIApi.getOperationStudyUnits).toHaveBeenCalledWith("s1268");
    expect(DDIApi.postPhysicalInstance).toHaveBeenCalledWith({
      physicalInstanceLabel: "Individus",
      dataRelationshipLabel: "Structure : Individus",
      logicalRecordLabel: "Enregistrement logique : Individus",
      groupId: "grp-1",
      groupAgency: "fr.insee",
      studyUnitId: "su-1",
      studyUnitAgency: "fr.insee",
    });
  });

  it("fait choisir l'étude quand l'opération en a plusieurs", async () => {
    vi.mocked(DDIApi.getOperationStudyUnits).mockResolvedValue([
      studyUnit("su-1", "Alpha"),
      studyUnit("su-2", "Bravo"),
    ]);

    renderButton();
    await userEvent.click(await newButton());
    const submit = screen.getByRole("button", {
      name: testsI18n.t("operationPhysicalInstance.create"),
    });
    await userEvent.type(
      screen.getByLabelText(testsI18n.t("operationPhysicalInstance.label")),
      "Individus",
    );
    expect(submit).toBeDisabled();

    await userEvent.click(screen.getByRole("radio", { name: "Bravo" }));
    await userEvent.click(submit);

    await screen.findByText("page de la PI");
    expect(DDIApi.postPhysicalInstance).toHaveBeenCalledWith(
      expect.objectContaining({ studyUnitId: "su-2" }),
    );
  });

  it("n'est pas proposé quand l'opération n'a pas d'étude DDI", async () => {
    vi.mocked(DDIApi.getOperationStudyUnits).mockResolvedValue([]);

    renderButton();

    await waitFor(() => expect(DDIApi.getOperationStudyUnits).toHaveBeenCalled());
    expect(
      screen.queryByRole("button", { name: testsI18n.t("operationPhysicalInstance.new") }),
    ).not.toBeInTheDocument();
  });

  it("n'est pas proposé sans droit de création de fichier de données", () => {
    mockCreateStrategy = "NONE";

    renderButton();

    expect(DDIApi.getOperationStudyUnits).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("button", { name: testsI18n.t("operationPhysicalInstance.new") }),
    ).not.toBeInTheDocument();
  });

  it("n'interroge pas le module DDI quand il n'est pas proposé", () => {
    mockVisibleModules = ["operations"];

    renderButton();

    expect(DDIApi.getOperationStudyUnits).not.toHaveBeenCalled();
  });

  it("affiche l'erreur du serveur et reste sur la fiche quand la création échoue", async () => {
    vi.mocked(DDIApi.getOperationStudyUnits).mockResolvedValue([studyUnit("su-1", "Alpha")]);
    vi.mocked(DDIApi.postPhysicalInstance).mockRejectedValue(new Error("boom"));

    renderButton();
    await userEvent.click(await newButton());
    await fillLabelAndSubmit("Individus");

    await screen.findByRole("alert");
    expect(screen.queryByText("page de la PI")).not.toBeInTheDocument();
  });
});
