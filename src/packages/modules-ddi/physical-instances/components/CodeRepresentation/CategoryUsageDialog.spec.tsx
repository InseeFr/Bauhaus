import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

import type { CategoryUsage } from "../../types/api";
import { CategoryUsageDialog } from "./CategoryUsageDialog";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) =>
      options ? `${key}|${JSON.stringify(options)}` : key,
  }),
}));

const mockUseCategoryUsers = vi.fn();
vi.mock("../../../hooks/useCategoryUsers", () => ({
  useCategoryUsers: (agencyId: string, id: string, enabled?: boolean) =>
    mockUseCategoryUsers(agencyId, id, enabled),
}));

const usage = (overrides: Partial<CategoryUsage> = {}): CategoryUsage => ({
  group: { agencyId: "fr.insee", id: "grp-1", label: "Recensement" },
  studyUnit: { agencyId: "fr.insee", id: "su-1", label: "Recensement 2024" },
  physicalInstance: { agencyId: "fr.insee", id: "pi-1", label: "Fichier détail" },
  variable: { agencyId: "fr.insee", id: "var-1", label: "Sexe" },
  codeList: { agencyId: "fr.insee", id: "cl-1", label: "Liste des sexes" },
  ...overrides,
});

const renderDialog = (visible = true) =>
  render(
    <MemoryRouter>
      <CategoryUsageDialog
        visible={visible}
        onHide={vi.fn()}
        agencyId="fr.insee"
        categoryId="cat-1"
        categoryLabel="Homme"
      />
    </MemoryRouter>,
  );

describe("CategoryUsageDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCategoryUsers.mockReturnValue({ data: [], isLoading: false, isError: false });
  });

  it("cites the category label in its header", () => {
    mockUseCategoryUsers.mockReturnValue({ data: [usage()], isLoading: false, isError: false });
    renderDialog();

    expect(
      screen.getByText('physicalInstance.view.code.categoryUsage.title|{"label":"Homme"}'),
    ).toBeInTheDocument();
  });

  it("lists the code lists using the category, panel already expanded", async () => {
    mockUseCategoryUsers.mockReturnValue({ data: [usage()], isLoading: false, isError: false });
    renderDialog();

    await waitFor(() => {
      expect(screen.getByText("Liste des sexes")).toBeInTheDocument();
    });
    expect(screen.getByRole("link", { name: "Sexe" })).toHaveAttribute(
      "href",
      "/ddi/physical-instances/fr.insee/pi-1?variableId=var-1",
    );
  });

  it("tells the user when the category is used nowhere else", () => {
    mockUseCategoryUsers.mockReturnValue({ data: [], isLoading: false, isError: false });
    renderDialog();

    expect(screen.getByText("physicalInstance.view.code.categoryUsage.empty")).toBeInTheDocument();
  });

  it("shows a loading message while the usages are being fetched", () => {
    mockUseCategoryUsers.mockReturnValue({ data: undefined, isLoading: true, isError: false });
    renderDialog();

    expect(
      screen.getByText("physicalInstance.view.code.categoryUsage.loading"),
    ).toBeInTheDocument();
  });

  it("tells the user when the usages could not be loaded", () => {
    mockUseCategoryUsers.mockReturnValue({ data: undefined, isLoading: false, isError: true });
    renderDialog();

    expect(screen.getByText("physicalInstance.view.code.categoryUsage.error")).toBeInTheDocument();
  });

  it("does not fetch the usages while closed", () => {
    renderDialog(false);

    expect(mockUseCategoryUsers).toHaveBeenCalledWith("fr.insee", "cat-1", false);
    expect(
      screen.queryByText('physicalInstance.view.code.categoryUsage.title|{"label":"Homme"}'),
    ).not.toBeInTheDocument();
  });
});
