import { screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { HomeDocument } from "../../model/operations/document";
import configureStore from "../../redux/configure-store";
import { mockReactQueryForRbac, renderWithRouter } from "../../tests/render";

describe("DocumentHome", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("should display the PageTitle component", async () => {
    mockReactQueryForRbac([
      {
        application: "OPERATION_DOCUMENT",
        privileges: [{ privilege: "CREATE", strategy: "ALL" }],
      },
    ]);

    const { default: DocumentHome } = await import("./home");

    const store = configureStore({
      users: { results: { stamp: "stamp" } },
      app: { auth: { user: {} } },
    });
    const { container } = renderWithRouter(
      <Provider store={store}>
        <DocumentHome documents={[]} />
      </Provider>,
    );
    expect(container.querySelectorAll("h1")).toHaveLength(1);
  });
  it("should display the SearchableList component", async () => {
    mockReactQueryForRbac([
      {
        application: "OPERATION_DOCUMENT",
        privileges: [{ privilege: "CREATE", strategy: "ALL" }],
      },
    ]);

    const { default: DocumentHome } = await import("./home");

    const store = configureStore({
      users: { results: { stamp: "stamp" } },
      app: { auth: { user: {} } },
    });
    const { container } = renderWithRouter(
      <Provider store={store}>
        <DocumentHome
          documents={
            [
              {
                id: "1",
                label: "label",
              },
            ] as unknown as HomeDocument[]
          }
        />
      </Provider>,
    );
    expect(container.querySelectorAll("ul")).toHaveLength(1);
    expect(container.querySelectorAll("li")).toHaveLength(1);
  });

  it("should display two Add buttons", async () => {
    const store = configureStore({
      users: { results: { stamp: "stamp" } },
      app: { auth: { user: {} } },
    });

    mockReactQueryForRbac([
      {
        application: "OPERATION_DOCUMENT",
        privileges: [{ privilege: "CREATE", strategy: "ALL" }],
      },
    ]);

    const { default: DocumentHome } = await import("./home");

    renderWithRouter(
      <Provider store={store}>
        <DocumentHome documents={[]} />
      </Provider>,
    );
    await screen.findByText("New Document");
    await screen.findByText("New Link");
  });
  it("should not display any Add button if the user is an the right role,", async () => {
    mockReactQueryForRbac([
      {
        application: "OPERATION_DOCUMENT",
        privileges: [],
      },
    ]);

    const store = configureStore({
      users: { results: { stamp: "stamp" } },
      app: { auth: { user: {} } },
    });
    const { default: DocumentHome } = await import("./home");

    renderWithRouter(
      <Provider store={store}>
        <DocumentHome documents={[]} />
      </Provider>,
    );
    expect(screen.queryByText("New Document")).toBeNull();
    expect(screen.queryByText("New Link")).toBeNull();
  });
});
