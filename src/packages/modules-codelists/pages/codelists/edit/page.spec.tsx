import { fireEvent, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { CodelistsApi } from "@sdk/index";

import { expectLoadErrorDisplayed } from "../../../testing/load-error.testing";
import { renderWithProviders } from "../../../testing/render.testing";
import { Component } from "./page";

const { detailedCodelistSdk, unknownCodelistRouter } = await vi.hoisted(
  () => import("../../../testing/pages.testing"),
);

vi.mock("@sdk/index", (importOriginal) =>
  detailedCodelistSdk(importOriginal, {
    putCodelist: vi.fn(),
    getCodelistCodes: vi.fn(() => Promise.resolve({ items: [] })),
    postCodesDetailedCodelist: vi.fn(),
    putCodesDetailedCodelist: vi.fn(),
    deleteCodesDetailedCodelist: vi.fn(),
  }),
);

vi.mock("react-router-dom", (importOriginal) => unknownCodelistRouter(importOriginal));

vi.mock("@utils/hooks/users", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@utils/hooks/users")>()),
  usePrivileges: () => ({
    privileges: [
      {
        application: "CODESLIST_CODESLIST",
        privileges: [
          { privilege: "CREATE", strategy: "ALL" },
          { privilege: "UPDATE", strategy: "ALL" },
        ],
      },
    ],
  }),
  useUserStamps: () => ({ data: [{ stamp: "DG75-L201" }] }),
}));

const codelist = {
  id: "CL_UNKNOWN",
  labelLg1: "Liste",
  labelLg2: "List",
  creator: "DG75-L201",
  contributor: ["DG75-L201"],
  disseminationStatus: "http://id.insee.fr/codes/base/statutDiffusion/PublicGenerique",
  lastListUriSegment: "list",
  lastCodeUriSegment: "code",
  lastClassUriSegment: "class",
};

const clickSave = () => fireEvent.click(screen.getAllByRole("button", { name: /save/i })[0]);

describe("Codelist edit page", () => {
  it("displays the server error when the codelist cannot be loaded", async () => {
    await expectLoadErrorDisplayed("getDetailedCodelist", <Component />);
  });

  describe("pending code changes", () => {
    beforeEach(() => {
      vi.mocked(CodelistsApi.getDetailedCodelist).mockResolvedValue({ ...codelist });
      vi.mocked(CodelistsApi.getCodesDetailedCodelist).mockResolvedValue({
        items: [{ code: "001", labelLg1: "Premier", labelLg2: "First" }],
        total: 1,
      });
      vi.mocked(CodelistsApi.deleteCodesDetailedCodelist).mockResolvedValue(undefined);
    });

    it("sends the code changes only once the codelist itself has been saved", async () => {
      const calls: string[] = [];
      vi.mocked(CodelistsApi.putCodelist).mockImplementation(async () => {
        calls.push("putCodelist");
      });
      vi.mocked(CodelistsApi.deleteCodesDetailedCodelist).mockImplementation(async () => {
        calls.push("deleteCode");
      });
      renderWithProviders(<Component />);

      fireEvent.click((await screen.findAllByLabelText(/remove/i))[0]);
      expect(CodelistsApi.deleteCodesDetailedCodelist).not.toHaveBeenCalled();
      clickSave();

      await waitFor(() => expect(calls).toEqual(["putCodelist", "deleteCode"]));
      expect(CodelistsApi.deleteCodesDetailedCodelist).toHaveBeenCalledWith(
        "CL_UNKNOWN",
        expect.objectContaining({ code: "001" }),
      );
    });

    it("sends no code change when the codelist cannot be saved", async () => {
      vi.mocked(CodelistsApi.putCodelist).mockRejectedValue({ message: "Invalid", status: 400 });
      renderWithProviders(<Component />);

      fireEvent.click((await screen.findAllByLabelText(/remove/i))[0]);
      clickSave();

      expect(await screen.findByRole("alert")).toHaveTextContent("Invalid");
      expect(CodelistsApi.deleteCodesDetailedCodelist).not.toHaveBeenCalled();
    });
  });
});
