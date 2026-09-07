import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { CodeListUsersPanel } from "./CodeListUsersPanel";
import type { CodeListUsage } from "../../types/api";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUseCodeListUsers = vi.fn();
vi.mock("../../../hooks/useCodeListUsers", () => ({
  useCodeListUsers: () => mockUseCodeListUsers(),
}));

const usage = (overrides: Partial<CodeListUsage> = {}): CodeListUsage => ({
  studyUnitAgencyId: "fr.insee",
  studyUnitId: "su-1",
  studyUnitLabel: "Recensement 2024",
  physicalInstanceAgencyId: "fr.insee",
  physicalInstanceId: "pi-1",
  physicalInstanceLabel: "Fichier détail",
  variableAgencyId: "fr.insee",
  variableId: "var-1",
  variableLabel: "Sexe",
  ...overrides,
});

const renderPanel = (currentVariableId?: string) =>
  render(
    <MemoryRouter>
      <CodeListUsersPanel agencyId="fr.insee" id="cl-1" currentVariableId={currentVariableId} />
    </MemoryRouter>,
  );

const expandPanel = () =>
  fireEvent.click(screen.getByText("physicalInstance.view.code.usersPanel.title"));

describe("CodeListUsersPanel", () => {
  it("renders the PhysicalInstance label as a link to the physical instance page", async () => {
    mockUseCodeListUsers.mockReturnValue({ data: [usage()], isLoading: false, isError: false });
    renderPanel();
    expandPanel();

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Fichier détail" })).toHaveAttribute(
        "href",
        "/ddi/physical-instances/fr.insee/pi-1",
      );
    });
    expect(screen.getByRole("link", { name: "Fichier détail" })).toHaveAttribute(
      "target",
      "_blank",
    );
  });

  it("renders the Variable label as a link carrying the variableId query parameter", async () => {
    mockUseCodeListUsers.mockReturnValue({ data: [usage()], isLoading: false, isError: false });
    renderPanel();
    expandPanel();

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Sexe" })).toHaveAttribute(
        "href",
        "/ddi/physical-instances/fr.insee/pi-1?variableId=var-1",
      );
    });
    expect(screen.getByRole("link", { name: "Sexe" })).toHaveAttribute("target", "_blank");
  });

  it("renders nothing when the code list has no usage", () => {
    mockUseCodeListUsers.mockReturnValue({ data: [], isLoading: false, isError: false });
    renderPanel();

    expect(
      screen.queryByText("physicalInstance.view.code.usersPanel.title"),
    ).not.toBeInTheDocument();
  });

  it("renders nothing while loading", () => {
    mockUseCodeListUsers.mockReturnValue({ data: [], isLoading: true, isError: false });
    renderPanel();

    expect(
      screen.queryByText("physicalInstance.view.code.usersPanel.title"),
    ).not.toBeInTheDocument();
  });

  it("excludes the variable currently being edited", () => {
    mockUseCodeListUsers.mockReturnValue({ data: [usage()], isLoading: false, isError: false });
    renderPanel("var-1");

    // The only usage is the current variable, so the whole block is hidden.
    expect(
      screen.queryByText("physicalInstance.view.code.usersPanel.title"),
    ).not.toBeInTheDocument();
  });

  it("keeps other variables when excluding the current one", async () => {
    mockUseCodeListUsers.mockReturnValue({
      data: [usage(), usage({ variableId: "var-2", variableLabel: "Âge" })],
      isLoading: false,
      isError: false,
    });
    renderPanel("var-1");
    expandPanel();

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Âge" })).toBeInTheDocument();
    });
    expect(screen.queryByRole("link", { name: "Sexe" })).not.toBeInTheDocument();
  });
});
