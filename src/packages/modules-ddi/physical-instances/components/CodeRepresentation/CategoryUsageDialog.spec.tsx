import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { CategoryUsageDialog } from "./CategoryUsageDialog";
import { categoryUsage as usage } from "./usages.testing";

vi.mock("react-i18next", () => import("../../../i18n.testing"));

const mockUseCategoryUsers = vi.fn();
vi.mock("../../../hooks/useCategoryUsers", () => ({
  useCategoryUsers: (agencyId: string, id: string, enabled?: boolean) =>
    mockUseCategoryUsers(agencyId, id, enabled),
}));

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
