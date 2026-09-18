import { vi } from "vitest";

import { expectLoadErrorDisplayed } from "../../../testing/load-error.testing";
import { Component } from "./page";

const { partialCodelistSdk, unknownCodelistRouter } = await vi.hoisted(
  () => import("../../../testing/pages.testing"),
);

vi.mock("@sdk/index", (importOriginal) =>
  partialCodelistSdk(importOriginal, { id: "CL_PARENT", labelLg1: "Parent", uri: "http://parent" }),
);

vi.mock("react-router-dom", (importOriginal) => unknownCodelistRouter(importOriginal));

describe("Partial codelist edit page", () => {
  it("displays the server error when the codelist cannot be loaded", async () => {
    await expectLoadErrorDisplayed("getCodelistPartial", <Component />);
  });
});
