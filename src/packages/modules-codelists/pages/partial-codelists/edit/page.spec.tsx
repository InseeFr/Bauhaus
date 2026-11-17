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

  describe("partial codelist refused by the server", () => {
    beforeEach(() => {
      vi.mocked(CodelistsApi.getCodelistPartial).mockResolvedValue({ ...partialCodelist });
    });

    it("should display a server field error next to its field, like a client-side error", async () => {
      vi.mocked(CodelistsApi.putCodelistPartial).mockRejectedValue({
        status: 400,
        message: "Validation failed",
        errors: [{ field: "labelLg1", message: "size must be between 0 and 3" }],
      });
      renderWithProviders(<Component />);

      await screen.findByDisplayValue("Liste partielle");
      clickSave();

      await waitFor(() =>
        expect(screen.getByDisplayValue("Liste partielle")).toHaveAccessibleDescription(
          "size must be between 0 and 3",
        ),
      );
      expect(screen.getByDisplayValue("Liste partielle")).toHaveAttribute("aria-invalid", "true");
    });

    it("should display in the error banner a server error on a field absent from the form", async () => {
      vi.mocked(CodelistsApi.putCodelistPartial).mockRejectedValue({
        status: 400,
        message: "Validation failed",
        errors: [{ field: "codes[A].iri", message: "must not be blank" }],
      });
      renderWithProviders(<Component />);

      await screen.findByDisplayValue("Liste partielle");
      clickSave();

      expect(await screen.findByRole("alert")).toHaveTextContent(
        "codes[A].iri : must not be blank",
      );
    });
  });
});
