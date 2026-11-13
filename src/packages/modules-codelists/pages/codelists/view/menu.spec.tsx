import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { UNPUBLISHED } from "@model/ValidationState";

import { mockCodelistPrivileges } from "../../../testing/users.testing";
import { ViewMenu } from "./menu";

vi.mock("@utils/hooks/users", () => import("../../../testing/users.testing"));

const stampGrants = [
  { privilege: "PUBLISH", strategy: "STAMP" },
  { privilege: "DELETE", strategy: "STAMP" },
  { privilege: "UPDATE", strategy: "STAMP" },
] as const;

const renderViewMenu = (codelist: Record<string, string>, deletable = true) =>
  render(
    <ViewMenu
      codelist={codelist}
      publish={vi.fn()}
      handleDelete={vi.fn()}
      handleBack={vi.fn()}
      handleUpdate={vi.fn() as VoidFunction}
      updatable={true}
      deletable={deletable}
    />,
  );

const expectOnlyBackButton = () => {
  screen.getByText("Back");
  expect(screen.queryByText("Publish")).toBeNull();
  expect(screen.queryByText("Delete")).toBeNull();
  expect(screen.queryByText("Update")).toBeNull();
};

const expectEveryButton = () => {
  screen.getByText("Back");
  screen.getByText("Publish");
  screen.getByText("Delete");
  screen.getByText("Update");
};

describe("Codes List View Menu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("a user can only see the go back button", () => {
    mockCodelistPrivileges([], ["stamp"]);

    renderViewMenu({ id: "1" });

    expectOnlyBackButton();
  });

  it("an admin can goBack, publish, delete and update a codelist even if the stamp is not correct", () => {
    mockCodelistPrivileges(
      [
        { privilege: "PUBLISH", strategy: "ALL" },
        { privilege: "DELETE", strategy: "ALL" },
        { privilege: "UPDATE", strategy: "ALL" },
      ],
      ["different-stamp"],
    );

    renderViewMenu({ id: "1" });

    expectEveryButton();
  });

  it("an Gestionnaire_liste_codes_RMESGNCS can goBack, publish, delete and update a codelist if the stamp is correct and validationState is unpublished", () => {
    mockCodelistPrivileges([...stampGrants], ["INSEE"]);

    renderViewMenu({ id: "1", contributor: "INSEE", validationState: UNPUBLISHED });

    expectEveryButton();
  });

  it("an Gestionnaire_liste_codes_RMESGNCS can goBack, publish and update a codelist if the stamp is correct and validationState is published", () => {
    mockCodelistPrivileges([...stampGrants], ["INSEE"]);

    renderViewMenu({ id: "1", contributor: "INSEE", validationState: "published" }, false);

    screen.getByText("Back");
    screen.getByText("Publish");
    expect(screen.queryByText("Delete")).toBeNull();
    screen.getByText("Update");
  });

  it("an Gestionnaire_liste_codes_RMESGNCS can only goBack if the stamp not is correct", () => {
    mockCodelistPrivileges([...stampGrants], ["XXXXXX"]);

    renderViewMenu({ id: "1", contributor: "INSEE" });

    expectOnlyBackButton();
  });
});
