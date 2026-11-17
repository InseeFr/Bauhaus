import { vi } from "vitest";

import { expectLoadErrorDisplayed } from "../../../testing/load-error.testing";
import { mockCodelistPrivileges } from "../../../testing/users.testing";
import { Component } from "./page";

const { detailedCodelistSdk } = await vi.hoisted(() => import("../../../testing/pages.testing"));

vi.mock("@sdk/index", (importOriginal) =>
  detailedCodelistSdk(importOriginal, { publishCodelist: vi.fn(), deleteCodelist: vi.fn() }),
);

vi.mock("@utils/hooks/users", () => import("../../../testing/users.testing"));

describe("Codelist view page", () => {
  beforeEach(() => {
    mockCodelistPrivileges([], ["stamp"]);
  });

  it("displays the server error when the codelist cannot be loaded", async () => {
    await expectLoadErrorDisplayed("getDetailedCodelist", <Component />);
  });
});
