import { render, screen } from "@testing-library/react";
import { describe, expect, it, Mock, vi } from "vitest";

import { useSecondLang } from "@utils/hooks/second-lang";

import D from "../../../../deprecated-locales/build-dictionary";
import { Distribution } from "../../../../model/Dataset";
import { ViewMainBlock } from "./view-main-block";

vi.mock("@utils/hooks/second-lang", () => ({
  useSecondLang: vi.fn(),
}));

describe("ViewMainBlock", () => {
  const mockDistribution = {
    created: "2023-01-01",
    updated: "2023-02-01",
    format: "PDF",
    byteSize: "15MB",
    url: "http://example.com",
    descriptionLg1: "Description content",
  } as Distribution;

  beforeEach(() => {
    vi.clearAllMocks();
    (useSecondLang as Mock).mockReturnValue([false]);
  });

  it("should render creation, modification, format, size, and URL information", () => {
    render(<ViewMainBlock distribution={mockDistribution} />);

    expect(screen.getByText(D.tailleTitle, { exact: false })).not.toBeNull();
    expect(screen.getByText(/15MB/, { exact: false })).not.toBeNull();
  });
});
