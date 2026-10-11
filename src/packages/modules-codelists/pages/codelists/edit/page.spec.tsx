import { fireEvent, screen, waitFor, within } from "@testing-library/react";
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

vi.mock("react-router", (importOriginal) => unknownCodelistRouter(importOriginal));

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

  describe("codelist refused by the server", () => {
    beforeEach(() => {
      vi.mocked(CodelistsApi.getDetailedCodelist).mockResolvedValue({ ...codelist });
      vi.mocked(CodelistsApi.getCodesDetailedCodelist).mockResolvedValue({ items: [], total: 0 });
    });

    it("should display a server field error next to its field, like a client-side error", async () => {
      vi.mocked(CodelistsApi.putCodelist).mockRejectedValue({
        status: 400,
        message: "Validation failed",
        errors: [{ field: "labelLg1", message: "size must be between 0 and 3" }],
      });
      renderWithProviders(<Component />);

      await screen.findByDisplayValue("Liste");
      clickSave();

      await waitFor(() =>
        expect(screen.getByDisplayValue("Liste")).toHaveAccessibleDescription(
          "size must be between 0 and 3",
        ),
      );
      expect(screen.getByDisplayValue("Liste")).toHaveAttribute("aria-invalid", "true");
    });

    it("should display in the error banner a server error on a field absent from the form", async () => {
      vi.mocked(CodelistsApi.putCodelist).mockRejectedValue({
        status: 400,
        message: "Validation failed",
        errors: [{ field: "codes[0].code", message: "must not be blank" }],
      });
      renderWithProviders(<Component />);

      await screen.findByDisplayValue("Liste");
      clickSave();

      expect(await screen.findByText("codes[0].code : must not be blank")).toBeInTheDocument();
    });
  });

  describe("code refused by the server", () => {
    beforeEach(() => {
      vi.mocked(CodelistsApi.getDetailedCodelist).mockResolvedValue({ ...codelist });
      vi.mocked(CodelistsApi.getCodesDetailedCodelist).mockResolvedValue({
        items: [{ code: "001", labelLg1: "Premier", labelLg2: "First" }],
        total: 1,
      });
      vi.mocked(CodelistsApi.putCodelist).mockResolvedValue(undefined);
    });

    const updateCodeThenSave = async (values: Record<string, string>) => {
      fireEvent.click((await screen.findAllByLabelText("See"))[0].querySelector("span")!);
      const panel = await screen.findByRole("complementary");
      for (const [name, value] of Object.entries(values)) {
        fireEvent.change(panel.querySelector(`#${name}`)!, { target: { name, value } });
      }
      fireEvent.click(within(panel).getByRole("button", { name: /update|modifier/i }));
      await waitFor(() => expect(screen.queryByRole("complementary")).toBeNull());
      clickSave();
    };

    it("reopens the refused code in the panel, with the error under its field", async () => {
      vi.mocked(CodelistsApi.putCodesDetailedCodelist).mockRejectedValue({
        status: 400,
        message: "Validation failed",
        errors: [{ field: "labelLg1", message: "size must be between 0 and 3" }],
      });
      renderWithProviders(<Component />);

      await updateCodeThenSave({ labelLg1: "Premier modifié" });

      const panel = await screen.findByRole("complementary");
      const labelLg1 = panel.querySelector("#labelLg1");
      expect(labelLg1).toHaveValue("Premier modifié");
      expect(labelLg1).toHaveAccessibleDescription("size must be between 0 and 3");
    });

    it("keeps an error without field slot readable in the reopened panel", async () => {
      vi.mocked(CodelistsApi.putCodesDetailedCodelist).mockRejectedValue({
        status: 400,
        message: "Validation failed",
        errors: [{ field: "descriptionLg1", message: "size must be between 0 and 3" }],
      });
      renderWithProviders(<Component />);

      await updateCodeThenSave({ descriptionLg1: "Description" });

      const panel = await screen.findByRole("complementary");
      expect(within(panel).getByRole("alert")).toHaveTextContent(
        "descriptionLg1 : size must be between 0 and 3",
      );
    });
  });
});
