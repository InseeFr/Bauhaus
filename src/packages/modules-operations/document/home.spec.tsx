import { screen } from "@testing-library/react";

import { MODULES, PRIVILEGES, STRATEGIES } from "@utils/hooks/rbac-constants";

import { HomeDocument } from "../../model/operations/document";
import { mockReactQueryForRbac, renderWithRouter } from "../../tests/render";

describe("DocumentHome", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("should display the PageTitle component", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.OPERATION_DOCUMENT,
        privileges: [{ privilege: PRIVILEGES.CREATE, strategy: STRATEGIES.ALL }],
      },
    ]);

    const { default: DocumentHome } = await import("./home");

    const { container } = renderWithRouter(<DocumentHome documents={[]} />);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
  });
  it("should display the SearchableList component", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.OPERATION_DOCUMENT,
        privileges: [{ privilege: PRIVILEGES.CREATE, strategy: STRATEGIES.ALL }],
      },
    ]);

    const { default: DocumentHome } = await import("./home");

    const { container } = renderWithRouter(
      <DocumentHome
        documents={
          [
            {
              id: "1",
              label: "label",
            },
          ] as unknown as HomeDocument[]
        }
      />,
    );
    expect(container.querySelectorAll("ul")).toHaveLength(1);
    expect(container.querySelectorAll("li")).toHaveLength(1);
  });

  it("should display two Add buttons", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.OPERATION_DOCUMENT,
        privileges: [{ privilege: PRIVILEGES.CREATE, strategy: STRATEGIES.ALL }],
      },
    ]);

    const { default: DocumentHome } = await import("./home");

    renderWithRouter(<DocumentHome documents={[]} />);
    await screen.findByText("New Document");
    await screen.findByText("New Link");
  });
  it("should not display any Add button if the user is an the right role,", async () => {
    mockReactQueryForRbac([
      {
        application: MODULES.OPERATION_DOCUMENT,
        privileges: [],
      },
    ]);

    const { default: DocumentHome } = await import("./home");

    renderWithRouter(<DocumentHome documents={[]} />);
    expect(screen.queryByText("New Document")).toBeNull();
    expect(screen.queryByText("New Link")).toBeNull();
  });
});
