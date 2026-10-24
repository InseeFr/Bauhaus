import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ReactNode } from "react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { createQueryWrapper } from "../../../hooks/queryClient.testing";
import {
  physicalInstanceQuery,
  usePhysicalInstancesData,
} from "../../../hooks/usePhysicalInstance";
import {
  physicalInstanceParentsQuery,
  usePhysicalInstanceParents,
} from "../../../hooks/usePhysicalInstanceParents";
import {
  PhysicalInstanceSearchRow,
  usePhysicalInstancesSearch,
} from "../../../hooks/usePhysicalInstancesSearch";
import { useReuseVariables } from "../../../hooks/useReuseVariables";
import { NewFromDialog } from "./NewFromDialog";

vi.mock("react-i18next", () => import("../../../i18n.testing"));
vi.mock("../../../hooks/usePhysicalInstancesSearch");
vi.mock("../../../hooks/usePhysicalInstanceParents");
vi.mock("../../../hooks/usePhysicalInstance");
vi.mock("../../../hooks/useReuseVariables");

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router")>()),
  useNavigate: () => mockNavigate,
}));

vi.mock("@components/select-rmes", async () => {
  const { NativeOptions } = await import("../../pages/pages.testing");
  return {
    Select: ({ inputId, value, options, onChange, disabled }: any) => (
      <select
        id={inputId}
        value={value ?? ""}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <option value="">-</option>
        <NativeOptions options={options} />
      </select>
    ),
  };
});

vi.mock("primereact/dialog", () => ({
  Dialog: ({ header, visible, children }: any) =>
    visible ? (
      <div role="dialog" aria-label={header}>
        {children}
      </div>
    ) : null,
}));

const row = (over: Partial<PhysicalInstanceSearchRow>): PhysicalInstanceSearchRow => ({
  agency: "fr.insee",
  id: "pi",
  label: "",
  versionDate: null,
  studyUnitAgency: "fr.insee",
  studyUnitId: "su",
  studyUnitLabel: "",
  groupAgency: "fr.insee",
  groupId: "g",
  groupLabel: "",
  ...over,
});

const rows = [
  row({
    id: "pi-1",
    label: "Recensement 2025",
    studyUnitId: "su-1",
    studyUnitLabel: "Recensement",
    groupId: "g-1",
    groupLabel: "Population",
  }),
  row({
    id: "pi-2",
    label: "Emploi T1",
    studyUnitId: "su-2",
    studyUnitLabel: "Enquête Emploi",
    groupId: "g-2",
    groupLabel: "Travail",
  }),
];

const mutateAsync = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(usePhysicalInstancesSearch).mockReturnValue({ data: rows, isLoading: false } as any);
  vi.mocked(usePhysicalInstanceParents).mockReturnValue({
    data: {
      studyUnit: { agency: "fr.insee", id: "su-1", label: "Recensement" },
      group: { agency: "fr.insee", id: "g-1", label: "Population" },
      stamps: [],
    },
    isLoading: false,
  } as any);
  vi.mocked(usePhysicalInstancesData).mockReturnValue({
    variables: [
      { id: "VAR_1", name: "SEXE", label: "Sexe", type: "code", lastModified: "" },
      { id: "VAR_2", name: "AGE", label: "Âge", type: "numeric", lastModified: "" },
    ],
    isLoading: false,
  } as any);
  vi.mocked(useReuseVariables).mockReturnValue({ mutateAsync, isPending: false } as any);
  mutateAsync.mockResolvedValue({ agency: "fr.insee", id: "pi-new" });
});

const wrapper = ({ children }: { children: ReactNode }) => {
  const QueryWrapper = createQueryWrapper();
  return (
    <QueryWrapper>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryWrapper>
  );
};

const renderDialog = () => render(<NewFromDialog visible onHide={vi.fn()} />, { wrapper });

/** Choisit « Recensement 2025 » puis le parcours « Réutiliser des variables ». */
const goToReuseForm = async () => {
  const user = userEvent.setup();
  renderDialog();
  await user.click(screen.getByRole("radio", { name: "Recensement 2025" }));
  await user.click(screen.getByRole("button", { name: "physicalInstance.newFrom.next" }));
  await user.click(
    screen.getByRole("button", { name: /physicalInstance\.newFrom\.reuseVariables\.title/ }),
  );
  return user;
};

describe("NewFromDialog", () => {
  it("liste les fichiers sources et les filtre par libellé", async () => {
    const user = userEvent.setup();
    renderDialog();

    expect(screen.getByRole("radio", { name: "Recensement 2025" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Emploi T1" })).toBeInTheDocument();

    await user.type(screen.getByLabelText("physicalInstance.search.labelFilter"), "emploi");

    expect(screen.queryByRole("radio", { name: "Recensement 2025" })).not.toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Emploi T1" })).toBeInTheDocument();
  });

  it("affiche chaque fichier comme sur l'accueil : libellé suivi de sa date", () => {
    vi.mocked(usePhysicalInstancesSearch).mockReturnValue({
      data: [row({ id: "pi-3", label: "Logement", versionDate: "2026-02-01T14:26:32" })],
      isLoading: false,
    } as any);

    renderDialog();

    expect(screen.getByRole("radio", { name: "Logement (01/02/2026)" })).toBeInTheDocument();
  });

  it("annonce le nombre de fichiers trouvés", async () => {
    const user = userEvent.setup();
    renderDialog();
    expect(screen.getByText(/^2 /)).toBeInTheDocument();

    await user.type(screen.getByLabelText("physicalInstance.search.labelFilter"), "emploi");

    expect(screen.getByText(/^1 /)).toBeInTheDocument();
  });

  it("filtre les fichiers sources par série", async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.selectOptions(screen.getByLabelText("physicalInstance.search.groupFilter"), "g-2");

    expect(screen.queryByRole("radio", { name: "Recensement 2025" })).not.toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Emploi T1" })).toBeInTheDocument();
  });

  it("filtre les fichiers sources par opération de la série choisie", async () => {
    const user = userEvent.setup();
    renderDialog();
    const studyUnitFilter = screen.getByLabelText("physicalInstance.search.studyUnitFilter");
    expect(studyUnitFilter).toBeDisabled();

    await user.selectOptions(screen.getByLabelText("physicalInstance.search.groupFilter"), "g-1");
    await user.selectOptions(studyUnitFilter, "su-1");

    expect(screen.getByRole("radio", { name: "Recensement 2025" })).toBeInTheDocument();
    expect(screen.queryByRole("radio", { name: "Emploi T1" })).not.toBeInTheDocument();
  });

  it("permet d'ouvrir un fichier source dans un nouvel onglet", () => {
    renderDialog();

    const link = screen.getByRole("link", {
      name:
        "physicalInstance.newFrom.openInNewTab|" + JSON.stringify({ label: "Recensement 2025" }),
    });
    expect(link).toHaveAttribute("href", "/ddi/physical-instances/fr.insee/pi-1");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("précharge les variables et les parents du fichier dès qu'il est coché", async () => {
    const fetchInstance = vi.fn().mockResolvedValue({});
    const fetchParents = vi.fn().mockResolvedValue({});
    vi.mocked(physicalInstanceQuery).mockReturnValue({
      queryKey: ["physicalInstanceById", "fr.insee", "pi-1"],
      queryFn: fetchInstance,
    } as any);
    vi.mocked(physicalInstanceParentsQuery).mockReturnValue({
      queryKey: ["physicalInstanceParents", "fr.insee", "pi-1"],
      queryFn: fetchParents,
    } as any);
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole("radio", { name: "Recensement 2025" }));

    expect(physicalInstanceQuery).toHaveBeenCalledWith("fr.insee", "pi-1");
    expect(physicalInstanceParentsQuery).toHaveBeenCalledWith("fr.insee", "pi-1");
    expect(fetchInstance).toHaveBeenCalled();
    expect(fetchParents).toHaveBeenCalled();
  });

  it("ne propose pas les fichiers rattachés à aucune opération", () => {
    vi.mocked(usePhysicalInstancesSearch).mockReturnValue({
      data: [
        ...rows,
        row({ id: "pi-orphan", label: "Orphelin", studyUnitId: null, groupId: null }),
      ],
      isLoading: false,
    } as any);

    renderDialog();

    expect(screen.queryByRole("radio", { name: "Orphelin" })).not.toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Recensement 2025" })).toBeInTheDocument();
  });

  it("explique pourquoi la création est impossible quand les parents de la source sont introuvables", async () => {
    vi.mocked(usePhysicalInstanceParents).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { status: 404, message: "not found", code: "DDI_STUDY_UNIT_NOT_FOUND" },
    } as any);
    const user = await goToReuseForm();

    await user.type(screen.getByLabelText("physicalInstance.creation.label"), "Recensement 2026");

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "physicalInstance.newFrom.create" })).toBeDisabled();
  });

  it("n'avance qu'une fois un fichier source choisi", async () => {
    const user = userEvent.setup();
    renderDialog();
    const next = screen.getByRole("button", { name: "physicalInstance.newFrom.next" });
    expect(next).toBeDisabled();

    await user.click(screen.getByRole("radio", { name: "Emploi T1" }));

    expect(next).toBeEnabled();
  });

  it("propose le parcours « Réutiliser des variables » pour la source choisie", async () => {
    const user = userEvent.setup();
    renderDialog();
    await user.click(screen.getByRole("radio", { name: "Recensement 2025" }));
    await user.click(screen.getByRole("button", { name: "physicalInstance.newFrom.next" }));

    const card = screen.getByRole("button", {
      name: /physicalInstance\.newFrom\.reuseVariables\.title/,
    });
    expect(
      within(card).getByText("physicalInstance.newFrom.reuseVariables.description"),
    ).toBeInTheDocument();
  });

  it("coche toutes les variables de la source, sans champ d'opération", async () => {
    await goToReuseForm();

    expect(usePhysicalInstanceParents).toHaveBeenCalledWith("fr.insee", "pi-1");
    expect(usePhysicalInstancesData).toHaveBeenCalledWith("fr.insee", "pi-1");
    expect(screen.queryByLabelText("physicalInstance.creation.studyUnit")).not.toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "SEXE — Sexe" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "AGE — Âge" })).toBeChecked();
  });

  it("crée le fichier avec les seules variables cochées puis l'ouvre", async () => {
    const user = await goToReuseForm();

    await user.type(screen.getByLabelText("physicalInstance.creation.label"), "Recensement 2026");
    await user.click(screen.getByRole("checkbox", { name: "AGE — Âge" }));
    await user.click(screen.getByRole("button", { name: "physicalInstance.newFrom.create" }));

    expect(mutateAsync).toHaveBeenCalledWith({
      agencyId: "fr.insee",
      id: "pi-1",
      data: {
        physicalInstanceLabel: "Recensement 2026",
        dataRelationshipLabel: "Structure : Recensement 2026",
        logicalRecordLabel: "Enregistrement logique : Recensement 2026",
        groupId: "g-1",
        groupAgency: "fr.insee",
        variableIds: ["VAR_1"],
      },
    });
    expect(mockNavigate).toHaveBeenCalledWith("/ddi/physical-instances/fr.insee/pi-new");
  });

  it("ne crée rien sans libellé ni variable cochée", async () => {
    const user = await goToReuseForm();
    const create = screen.getByRole("button", { name: "physicalInstance.newFrom.create" });
    expect(create).toBeDisabled();

    await user.type(screen.getByLabelText("physicalInstance.creation.label"), "Recensement 2026");
    expect(create).toBeEnabled();

    await user.click(screen.getByRole("checkbox", { name: "physicalInstance.newFrom.selectAll" }));
    expect(screen.getByRole("checkbox", { name: "SEXE — Sexe" })).not.toBeChecked();
    expect(create).toBeDisabled();
  });

  it("revient au choix de la source", async () => {
    const user = await goToReuseForm();

    await user.click(screen.getByRole("button", { name: "physicalInstance.newFrom.back" }));
    await user.click(screen.getByRole("button", { name: "physicalInstance.newFrom.back" }));

    expect(screen.getByRole("radio", { name: "Recensement 2025" })).toBeChecked();
  });

  it("affiche l'erreur du back sans quitter le formulaire", async () => {
    mutateAsync.mockRejectedValue({
      status: 400,
      message: "boom",
      code: "REUSE_VARIABLES_NOT_IN_SOURCE",
    });
    const user = await goToReuseForm();

    await user.type(screen.getByLabelText("physicalInstance.creation.label"), "Recensement 2026");
    await user.click(screen.getByRole("button", { name: "physicalInstance.newFrom.create" }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
