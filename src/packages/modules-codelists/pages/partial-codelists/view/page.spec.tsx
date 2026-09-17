import { vi } from "vitest";

import { expectLoadErrorDisplayed } from "../../../testing/load-error.testing";
import { mockCodelistPrivileges } from "../../../testing/users.testing";
import { Component } from "./page";

const { partialCodelistSdk, unknownCodelistRouter } = await vi.hoisted(
  () => import("../../../testing/pages.testing"),
);

vi.mock("@sdk/index", (importOriginal) =>
  partialCodelistSdk(importOriginal, { id: "CL_PARENT", uri: "http://parent" }),
);

vi.mock("@utils/hooks/users", () => import("../../../testing/users.testing"));

vi.mock("react-router-dom", (importOriginal) => unknownCodelistRouter(importOriginal));

describe("Partial codelist view page", () => {
  beforeEach(() => {
    mockCodelistPrivileges([], ["stamp"]);
  });

  it("displays the server error instead of crashing when the codelist cannot be loaded", async () => {
    await expectLoadErrorDisplayed("getCodelistPartial", <Component />);
  });
});
