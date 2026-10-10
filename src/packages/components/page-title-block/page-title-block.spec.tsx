import { vi } from "vitest";

import { useSecondLang } from "@utils/hooks/second-lang";

import { renderWithAppContext } from "../../tests/render";
import { PageTitleBlock } from "./";

vi.mock("../../utils/hooks/second-lang", () => ({
  useSecondLang: vi.fn(),
}));

const renderPageTitleBlock = (secondLang: boolean, titleLg2?: string) => {
  vi.mocked(useSecondLang).mockReturnValue([secondLang, vi.fn()]);
  return renderWithAppContext(<PageTitleBlock titleLg1="titleLg1" titleLg2={titleLg2} />);
};

const expectTitles = (container: HTMLElement, subtitleCount: number) => {
  expect(container.querySelectorAll("h2")).toHaveLength(1);
  expect(container.querySelectorAll("h2 div")).toHaveLength(subtitleCount);
};

describe("page-title-bloc", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders one PageTitle only is secondLang is false", () => {
    const { container } = renderPageTitleBlock(false);
    expectTitles(container, 0);
  });

  it("renders one PageTitle only if titleLg2 is undefined", () => {
    const { container } = renderPageTitleBlock(true);
    expectTitles(container, 0);
  });

  it("renders one PageTitle and one PageSubstitle", () => {
    const { container } = renderPageTitleBlock(true, "titleLg2");
    expectTitles(container, 1);
  });
});
