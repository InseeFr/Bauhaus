import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { clearDevUser, devUserHeaders, saveDevUser } from "@sdk/dev-user";
import { StampsApi, V2Api } from "@sdk/index";

import { DevUserPlugin } from "./DevUserPlugin";

vi.mock("@sdk/index", () => ({
  StampsApi: { getStamps: vi.fn() },
  V2Api: { getStamps: vi.fn() },
}));

const renderPlugin = () => {
  vi.mocked(StampsApi.getStamps).mockResolvedValue(["DG75-A001", "DG75-F302"]);
  vi.mocked(V2Api.getStamps).mockResolvedValue([
    { stamp: "HIE2000331", label: "Direction des statistiques démographiques" },
  ]);
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const invalidate = vi.spyOn(queryClient, "invalidateQueries");
  render(
    <QueryClientProvider client={queryClient}>
      <DevUserPlugin />
    </QueryClientProvider>,
  );
  return { invalidate };
};

// Le champ lié au <label> de PrimeReact est masqué : le panneau s'ouvre au clic sur le composant.
const openSelect = (label: string) =>
  fireEvent.click(screen.getByLabelText(label).closest("[data-pc-name]")!);

describe("DevUserPlugin", () => {
  afterEach(() => clearDevUser());

  it("sends the chosen user with every API call and refreshes every query", async () => {
    const { invalidate } = renderPlugin();

    openSelect("Rôles");
    fireEvent.click(screen.getByText("Gestionnaire_variables_RMESGNCS"));
    fireEvent.click(screen.getByText("Utilisateur_RMESGNCS"));
    openSelect("Timbre");
    fireEvent.click(
      await screen.findByText("HIE2000331 - Direction des statistiques démographiques"),
    );
    openSelect("Source");
    fireEvent.click(screen.getByText("ssm"));
    fireEvent.click(screen.getByRole("button", { name: "Appliquer" }));

    expect(devUserHeaders()).toEqual({
      "X-Dev-User-Roles": "Gestionnaire_variables_RMESGNCS,Utilisateur_RMESGNCS",
      "X-Dev-User-Stamps": "HIE2000331",
      "X-Dev-User-Source": "ssm",
    });
    expect(invalidate).toHaveBeenCalledWith();
  });

  it("offers the DG75 and SSM stamps as well as the HIE ones", async () => {
    renderPlugin();

    openSelect("Timbre");

    expect(await screen.findByText("DG75-F302")).toBeInTheDocument();
    expect(
      await screen.findByText("HIE2000331 - Direction des statistiques démographiques"),
    ).toBeInTheDocument();
  });

  it("lets the stamps be filtered by a search field", async () => {
    renderPlugin();
    openSelect("Timbre");
    await screen.findByText("DG75-F302");

    // Les panneaux PrimeReact sont animés (pointer-events: none pendant la transition).
    await userEvent
      .setup({ pointerEventsCheck: 0 })
      .type(screen.getByPlaceholderText("Rechercher un timbre"), "HIE");

    await waitFor(() => expect(screen.queryByText("DG75-F302")).not.toBeInTheDocument());
    expect(
      screen.getByText("HIE2000331 - Direction des statistiques démographiques"),
    ).toBeInTheDocument();
  });

  it("shows the user already applied in this session", async () => {
    saveDevUser({ roles: ["Administrateur_RMESGNCS"], stamps: ["HIE2000331"], source: "insee" });

    renderPlugin();

    expect(screen.getByText("Administrateur_RMESGNCS")).toBeInTheDocument();
    expect(
      await screen.findByText("HIE2000331 - Direction des statistiques démographiques", {
        selector: ".p-dropdown-label",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("insee", { selector: ".p-dropdown-label" })).toBeInTheDocument();
  });

  it("goes back to the user configured on the back-end", () => {
    saveDevUser({ roles: ["Administrateur_RMESGNCS"], stamps: [], source: "" });
    const { invalidate } = renderPlugin();

    fireEvent.click(screen.getByRole("button", { name: "Réinitialiser" }));

    expect(devUserHeaders()).toEqual({});
    expect(screen.queryByText("Administrateur_RMESGNCS")).not.toBeInTheDocument();
    expect(invalidate).toHaveBeenCalledWith();
  });
});
