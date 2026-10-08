import { fireEvent, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { CodelistsApi } from "@sdk/index";

import { expectLoadErrorDisplayed } from "../../../testing/load-error.testing";
import { renderWithProviders } from "../../../testing/render.testing";
import { Component } from "./page";

const { partialCodelistSdk, unknownCodelistRouter } = await vi.hoisted(
  () => import("../../../testing/pages.testing"),
);

vi.mock("@sdk/index", (importOriginal) =>
  partialCodelistSdk(
    importOriginal,
    { id: "CL_PARENT", labelLg1: "Parent", uri: "http://parent" },
    { putCodelistPartial: vi.fn() },
  ),
);

vi.mock("react-router", (importOriginal) => unknownCodelistRouter(importOriginal));

const partialCodelist = {
  id: "CL_UNKNOWN",
  labelLg1: "Liste partielle",
  labelLg2: "Partial list",
  creator: "DG75-L201",
  contributor: ["DG75-L201"],
  disseminationStatus: "http://id.insee.fr/codes/base/statutDiffusion/PublicGenerique",
  iriParent: "http://parent",
};

const clickSave = () => fireEvent.click(screen.getAllByRole("button", { name: /save/i })[0]);

describe("Partial codelist edit page", () => {
  it("displays the server error when the codelist cannot be loaded", async () => {
    await expectLoadErrorDisplayed("getCodelistPartial", <Component />);
  });

  it("saves a loaded partial codelist under its parent", async () => {
    vi.mocked(CodelistsApi.getCodelistPartial).mockResolvedValue({ ...partialCodelist });
    vi.mocked(CodelistsApi.putCodelistPartial).mockResolvedValue(undefined);
    renderWithProviders(<Component />);

    await screen.findByDisplayValue("Liste partielle");
    clickSave();

    await waitFor(() =>
      expect(CodelistsApi.putCodelistPartial).toHaveBeenCalledWith(
        expect.objectContaining({ id: "CL_UNKNOWN", parentCode: "CL_PARENT" }),
      ),
    );
  });
});
