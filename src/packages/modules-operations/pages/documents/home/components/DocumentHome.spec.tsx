import { screen, within } from "@testing-library/react";

import { HomeDocument } from "@model/operations/document";

import { MODULES, PRIVILEGE, PRIVILEGES } from "@utils/hooks/rbac-constants";

import { renderWithRouter } from "../../../../../tests/render";
import { importWithRbac, rbacFor, resetRbacMocks } from "../../../menu-rbac.testing";

const renderHome = async (
  privileges: PRIVILEGE[],
  documents: HomeDocument[] = [],
  url = "/operations/documents",
) => {
  const { DocumentHome } = await importWithRbac(
    [rbacFor(MODULES.OPERATION_DOCUMENT, privileges)],
    () => import("./DocumentHome"),
  );
  return renderWithRouter(<DocumentHome documents={documents} />, [url]);
};

const report: HomeDocument = {
  id: "1",
  label: "Rapport annuel",
  uri: "http://bauhaus/operations/document/1",
  lang: "fr",
  updatedDate: "2024-03-05",
};

const attendance: HomeDocument = {
  id: "2",
  label: "Fréquentation",
  uri: "http://bauhaus/operations/page/2",
  lang: "en",
  updatedDate: "",
};

describe("DocumentHome", () => {
  afterEach(resetRbacMocks);

  it("should display the PageTitle component", async () => {
    const { container } = await renderHome([PRIVILEGES.CREATE]);

    expect(container.querySelectorAll("h1")).toHaveLength(1);
  });
  it("lists each document or link as a row pointing to its page", async () => {
    await renderHome([PRIVILEGES.CREATE], [report, attendance]);

    const rows = within(screen.getByRole("table")).getAllByRole("row");
    expect(rows).toHaveLength(2);
    expect(within(rows[0]).getByRole("link")).toHaveAttribute("href", "/operations/document/1");
    expect(rows[0]).toHaveTextContent("Rapport annuel (fr-05/03/2024)");
    expect(within(rows[1]).getByRole("link")).toHaveAttribute("href", "/operations/link/2");
    expect(rows[1]).toHaveTextContent("Fréquentation (en)");
  });

  it("searches the documents by label only", async () => {
    await renderHome([PRIVILEGES.CREATE], [report, attendance], "/operations/documents?search=fr");

    expect(screen.getByText("Fréquentation")).toBeInTheDocument();
    expect(screen.queryByText("Rapport annuel")).not.toBeInTheDocument();
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
