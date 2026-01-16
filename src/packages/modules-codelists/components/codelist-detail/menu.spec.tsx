import { render, screen } from "@testing-library/react";
import { Mock, vi } from "vitest";

import { UNPUBLISHED } from "../../../model/ValidationState";
import { usePrivileges, useUserStamps } from "@utils/hooks/users";
import { ViewMenu } from "./menu";

vi.mock("@utils/hooks/users", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@utils/hooks/users")>();
  return {
    ...actual,
    usePrivileges: vi.fn(),
    useUserStamps: vi.fn(),
  };
});

describe("Codes List View Menu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("a user can only see the go back button", () => {
    (usePrivileges as Mock).mockReturnValue({ privileges: [] });
    (useUserStamps as Mock).mockReturnValue({ data: [{ stamp: "stamp" }] });

    const codesList = { id: "1" };
    render(
      <ViewMenu
        codelist={codesList}
        publish={vi.fn()}
        handleDelete={vi.fn()}
        handleBack={vi.fn()}
        handleUpdate={vi.fn()}
        updatable={true}
        deletable={true}
      />,
    );

    screen.getByText("Back");
    expect(screen.queryByText("Publish")).toBeNull();
    expect(screen.queryByText("Delete")).toBeNull();
    expect(screen.queryByText("Update")).toBeNull();
  });

  it("an admin can goBack, publish, delete and update a codelist even if the stamp is not correct", () => {
    (usePrivileges as Mock).mockReturnValue({
      privileges: [
        {
          application: "CODESLIST_CODESLIST",
          privileges: [
            { privilege: "PUBLISH", strategy: "ALL" },
            { privilege: "DELETE", strategy: "ALL" },
            { privilege: "UPDATE", strategy: "ALL" },
          ],
        },
      ],
    });
    (useUserStamps as Mock).mockReturnValue({
      data: [{ stamp: "different-stamp" }],
    });

    const codesList = { id: "1" };

    render(
      <ViewMenu
        codelist={codesList}
        publish={vi.fn()}
        handleDelete={vi.fn()}
        handleBack={vi.fn()}
        handleUpdate={vi.fn()}
        updatable={true}
        deletable={true}
      />,
    );

    screen.getByText("Back");
    screen.getByText("Publish");
    screen.getByText("Delete");
    screen.getByText("Update");
  });

  it("an Gestionnaire_liste_codes_RMESGNCS can goBack, publish, delete and update a codelist if the stamp is correct and validationState is unpublished", () => {
    (usePrivileges as Mock).mockReturnValue({
      privileges: [
        {
          application: "CODESLIST_CODESLIST",
          privileges: [
            { privilege: "PUBLISH", strategy: "STAMP" },
            { privilege: "DELETE", strategy: "STAMP" },
            { privilege: "UPDATE", strategy: "STAMP" },
          ],
        },
      ],
    });
    (useUserStamps as Mock).mockReturnValue({
      data: [{ stamp: "INSEE" }],
    });

    const codesList = {
      id: "1",
      contributor: "INSEE",
      validationState: UNPUBLISHED,
    };

    render(
      <ViewMenu
        codelist={codesList}
        publish={vi.fn()}
        handleDelete={vi.fn()}
        handleBack={vi.fn()}
        handleUpdate={vi.fn()}
        updatable={true}
        deletable={true}
      />,
    );

    screen.getByText("Back");
    screen.getByText("Publish");
    screen.getByText("Delete");
    screen.getByText("Update");
  });

  it("an Gestionnaire_liste_codes_RMESGNCS can goBack, publish and update a codelist if the stamp is correct and validationState is published", () => {
    (usePrivileges as Mock).mockReturnValue({
      privileges: [
        {
          application: "CODESLIST_CODESLIST",
          privileges: [
            { privilege: "PUBLISH", strategy: "STAMP" },
            { privilege: "DELETE", strategy: "STAMP" },
            { privilege: "UPDATE", strategy: "STAMP" },
          ],
        },
      ],
    });
    (useUserStamps as Mock).mockReturnValue({
      data: [{ stamp: "INSEE" }],
    });

    const codesList = {
      id: "1",
      contributor: "INSEE",
      validationState: "published",
    };

    render(
      <ViewMenu
        codelist={codesList}
        publish={vi.fn()}
        handleDelete={vi.fn()}
        handleBack={vi.fn()}
        handleUpdate={vi.fn()}
        updatable={true}
        deletable={false}
      />,
    );

    screen.getByText("Back");
    screen.getByText("Publish");
    expect(screen.queryByText("Delete")).toBeNull();
    screen.getByText("Update");
  });

  it("an Gestionnaire_liste_codes_RMESGNCS can only goBack if the stamp not is correct", () => {
    (usePrivileges as Mock).mockReturnValue({
      privileges: [
        {
          application: "CODESLIST_CODESLIST",
          privileges: [
            { privilege: "PUBLISH", strategy: "STAMP" },
            { privilege: "DELETE", strategy: "STAMP" },
            { privilege: "UPDATE", strategy: "STAMP" },
          ],
        },
      ],
    });
    (useUserStamps as Mock).mockReturnValue({
      data: [{ stamp: "XXXXXX" }],
    });

    const codesList = { id: "1", contributor: "INSEE" };

    render(
      <ViewMenu
        codelist={codesList}
        publish={vi.fn()}
        handleDelete={vi.fn()}
        handleBack={vi.fn()}
        handleUpdate={vi.fn()}
        updatable={true}
        deletable={true}
      />,
    );

    screen.getByText("Back");
    expect(screen.queryByText("Publish")).toBeNull();
    expect(screen.queryByText("Delete")).toBeNull();
    expect(screen.queryByText("Update")).toBeNull();
  });
});
