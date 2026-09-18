import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

import type { CodeListUsage } from "../../types/api";
import { CodeListUsersPanel } from "./CodeListUsersPanel";
import { codeListUsage as usage } from "./usages.testing";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUseCodeListUsers = vi.fn();
vi.mock("../../../hooks/useCodeListUsers", () => ({
  useCodeListUsers: () => mockUseCodeListUsers(),
}));

const mockUsages = (data: CodeListUsage[], isLoading = false) =>
  mockUseCodeListUsers.mockReturnValue({ data, isLoading, isError: false });

const renderPanel = (currentVariableId?: string) =>
  render(
    <MemoryRouter>
      <CodeListUsersPanel agencyId="fr.insee" id="cl-1" currentVariableId={currentVariableId} />
    </MemoryRouter>,
  );

const expandPanel = () =>
  fireEvent.click(screen.getByText("physicalInstance.view.code.usersPanel.title"));

/** Rend le panneau sur un seul usage (Sexe dans Fichier détail) et le déplie. */
const renderExpandedSingleUsage = () => {
  mockUsages([usage()]);
  renderPanel();
  expandPanel();
};

describe("CodeListUsersPanel", () => {
  it("renders the PhysicalInstance label as a link to the physical instance page", async () => {
    renderExpandedSingleUsage();

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
    renderExpandedSingleUsage();

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Sexe" })).toHaveAttribute(
        "href",
        "/ddi/physical-instances/fr.insee/pi-1?variableId=var-1",
      );
    });
    expect(screen.getByRole("link", { name: "Sexe" })).toHaveAttribute("target", "_blank");
  });

  it("renders nothing when the code list has no usage", () => {
    mockUsages([]);
    renderPanel();

    expect(
      screen.queryByText("physicalInstance.view.code.usersPanel.title"),
    ).not.toBeInTheDocument();
  });

  it("renders nothing while loading", () => {
    mockUsages([], true);
    renderPanel();

    expect(
      screen.queryByText("physicalInstance.view.code.usersPanel.title"),
    ).not.toBeInTheDocument();
  });

  it("excludes the variable currently being edited", () => {
    mockUsages([usage()]);
    renderPanel("var-1");

    // The only usage is the current variable, so the whole block is hidden.
    expect(
      screen.queryByText("physicalInstance.view.code.usersPanel.title"),
    ).not.toBeInTheDocument();
  });

  it("keeps other variables when excluding the current one", async () => {
    mockUsages([usage(), usage({ variableId: "var-2", variableLabel: "Âge" })]);
    renderPanel("var-1");
    expandPanel();

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Âge" })).toBeInTheDocument();
    });
    expect(screen.queryByRole("link", { name: "Sexe" })).not.toBeInTheDocument();
  });
});
