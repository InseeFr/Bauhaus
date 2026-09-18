import { vi } from "vitest";

import { expectLoadErrorDisplayed } from "../../../testing/load-error.testing";
import { Component } from "./page";

const { detailedCodelistSdk, unknownCodelistRouter } = await vi.hoisted(
  () => import("../../../testing/pages.testing"),
);

vi.mock("@sdk/index", (importOriginal) => detailedCodelistSdk(importOriginal));

vi.mock("react-router-dom", (importOriginal) => unknownCodelistRouter(importOriginal));

describe("Codelist edit page", () => {
  it("displays the server error when the codelist cannot be loaded", async () => {
    await expectLoadErrorDisplayed("getDetailedCodelist", <Component />);
  });
});
