import { screen } from "@testing-library/react";

import { getListItems } from "@components/ui/list-group/testing";

import { HomeDocument } from "@model/operations/document";

import { MODULES, PRIVILEGE, PRIVILEGES } from "@utils/hooks/rbac-constants";

import { renderWithRouter } from "../../../../../tests/render";
import { importWithRbac, rbacFor, resetRbacMocks } from "../../../menu-rbac.testing";

const renderHome = async (privileges: PRIVILEGE[], documents: HomeDocument[] = []) => {
  const { DocumentHome } = await importWithRbac(
    [rbacFor(MODULES.OPERATION_DOCUMENT, privileges)],
    () => import("./DocumentHome"),
  );
  return renderWithRouter(<DocumentHome documents={documents} />);
};

describe("DocumentHome", () => {
  afterEach(resetRbacMocks);

  it("should display the PageTitle component", async () => {
    const { container } = await renderHome([PRIVILEGES.CREATE]);

    expect(container.querySelectorAll("h1")).toHaveLength(1);
  });
  it("should display the SearchableList component", async () => {
    const { container } = await renderHome([PRIVILEGES.CREATE], [
      {
        id: "1",
        label: "label",
      },
    ] as unknown as HomeDocument[]);
    // With pagination, there are now 2 <ul>: one for documents, one for pagination
    expect(container.querySelectorAll("ul")).toHaveLength(2);
    expect(getListItems(container)).toHaveLength(1);
  });

  it("should display two Add buttons", async () => {
    await renderHome([PRIVILEGES.CREATE]);

    await screen.findByText("New Document");
    await screen.findByText("New Link");
  });
  it("should not display any Add button if the user is an the right role,", async () => {
    await renderHome([]);

    expect(screen.queryByText("New Document")).toBeNull();
    expect(screen.queryByText("New Link")).toBeNull();
  });
});
