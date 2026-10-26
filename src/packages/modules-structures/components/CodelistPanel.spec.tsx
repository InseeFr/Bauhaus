import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { useAllCodes } from "@utils/hooks/codelist";

import { expectNoBootstrapClass } from "../../tests/bootstrap-classes.testing";
import { CodelistPanel } from "./CodelistPanel";

vi.mock("@utils/hooks/codelist", () => ({ useAllCodes: vi.fn() }));

describe("CodelistPanel", () => {
  it("ne pose aucune classe Bootstrap", async () => {
    vi.mocked(useAllCodes).mockReturnValue({
      data: [{ code: "001", labelLg1: "Premier" }],
    } as unknown as ReturnType<typeof useAllCodes>);

    render(<CodelistPanel isOpen handleBack={vi.fn()} codelist={{ notation: "CL_1" }} />);

    await screen.findByText(/001 - Premier/);
    expectNoBootstrapClass();
  });

  it("se ferme quand on annule", async () => {
    vi.mocked(useAllCodes).mockReturnValue({ data: [] } as unknown as ReturnType<
      typeof useAllCodes
    >);
    const handleBack = vi.fn();

    render(<CodelistPanel isOpen handleBack={handleBack} codelist={{ notation: "CL_1" }} />);

    (await screen.findByRole("button", { name: /cancel|annuler/i })).click();
    expect(handleBack).toHaveBeenCalled();
  });
});
