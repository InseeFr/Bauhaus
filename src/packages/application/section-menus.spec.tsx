import { render, screen, within } from "@testing-library/react";
import { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { MODULES, PRIVILEGES, STRATEGIES } from "@utils/hooks/rbac-constants";
import type { MODULE, Privilege } from "@utils/hooks/rbac-constants";
import { usePrivileges } from "@utils/hooks/users";

import { AppContextProvider } from "./app-context";
import type { AppName, AppProperties } from "./app-context";
import { AdministrationMenu, DataDescriptionMenu } from "./section-menus";

vi.mock("@utils/hooks/users", () => ({
  usePrivileges: vi.fn(),
}));

const APPLICATIONS: Record<AppName, MODULE> = {
  concepts: MODULES.CONCEPT_CONCEPT,
  classifications: MODULES.CLASSIFICATION_CLASSIFICATION,
  operations: MODULES.OPERATION_SERIES,
  structures: MODULES.STRUCTURE_STRUCTURE,
  codelists: MODULES.CODESLIST_CODESLIST,
  datasets: MODULES.DATASET_DATASET,
  ddi: MODULES.DDI_PHYSICALINSTANCE,
};

const ALL_MODULES = Object.keys(APPLICATIONS) as AppName[];

const properties: AppProperties = {
  modules: ALL_MODULES.map((identifier) => ({ identifier, show: true, directAccess: true })),
  defaultContributor: "",
  maxLengthScopeNote: "",
  extraMandatoryFields: "",
  defaultAgencyId: "",
};

/* Rend le menu sur `pathname`, pour un utilisateur qui a accès en lecture aux seuls
   modules `readable`, tous déclarés visibles dans la configuration. */
const renderMenu = (menu: ReactNode, pathname: string, readable: AppName[] = ALL_MODULES) => {
  const privileges: Privilege[] = readable.map((module) => ({
    application: APPLICATIONS[module],
    privileges: [{ privilege: PRIVILEGES.READ, strategy: STRATEGIES.ALL }],
  }));
  vi.mocked(usePrivileges).mockReturnValue({ isPending: false, privileges });

  return render(
    <AppContextProvider lg1="fr" lg2="en" properties={properties}>
      <MemoryRouter initialEntries={[pathname]}>{menu}</MemoryRouter>
    </AppContextProvider>,
  );
};

const entries = () =>
  within(screen.getByRole("navigation"))
    .getAllByRole("listitem")
    .map((item) => item.textContent);

const current = () =>
  within(screen.getByRole("navigation"))
    .getAllByRole("link")
    .filter((link) => link.getAttribute("aria-current") === "page")
    .map((link) => link.textContent);

describe("DataDescriptionMenu", () => {
  it("offers the datasets, the distributions, the variables and the upcoming codelists", () => {
    renderMenu(<DataDescriptionMenu />, "/datasets");

    expect(entries()).toEqual(["Home", "Datasets", "Distributions", "Variables", "Codelists"]);
    expect(screen.getByRole("link", { name: "Variables" })).toHaveAttribute("href", "/ddi");
  });

  it("greys out the codelists, which are not available yet", () => {
    renderMenu(<DataDescriptionMenu />, "/datasets");

    expect(screen.queryByRole("link", { name: "Codelists" })).toBeNull();
    expect(screen.getByText("Codelists")).toHaveAttribute("aria-disabled", "true");
  });

  it("marks the most specific entry as the current page", () => {
    renderMenu(<DataDescriptionMenu />, "/datasets/distributions/d-1");

    expect(current()).toEqual(["Distributions"]);
  });

  it("marks the variables as the current page inside the DDI module", () => {
    renderMenu(<DataDescriptionMenu />, "/ddi/physical-instances/fr.insee/abc");

    expect(current()).toEqual(["Variables"]);
  });

  it("does not offer the variables to a user who has no access to them", () => {
    renderMenu(<DataDescriptionMenu />, "/datasets", ["datasets"]);

    expect(screen.queryByRole("link", { name: "Variables" })).toBeNull();
  });
});

describe("AdministrationMenu", () => {
  it("offers the codelists, the structures and the components", () => {
    renderMenu(<AdministrationMenu />, "/codelists");

    expect(entries()).toEqual(["Home", "Codelists", "Structures", "Components"]);
    expect(screen.getByRole("link", { name: "Components" })).toHaveAttribute(
      "href",
      "/structures/components",
    );
  });

  it("marks the components, not the structures, on a component page", () => {
    renderMenu(<AdministrationMenu />, "/structures/components/c-1");

    expect(current()).toEqual(["Components"]);
  });

  it("marks the codelists on a partial codelist page", () => {
    renderMenu(<AdministrationMenu />, "/codelists/partial/p-1");

    expect(current()).toEqual(["Codelists"]);
  });

  it("does not offer the structures nor the components to a user who has no access to them", () => {
    renderMenu(<AdministrationMenu />, "/codelists", ["codelists"]);

    expect(entries()).toEqual(["Home", "Codelists"]);
  });
});
