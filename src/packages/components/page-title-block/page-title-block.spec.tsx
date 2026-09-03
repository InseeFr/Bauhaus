import { vi } from "vitest";

import { renderWithAppContext } from "../../tests/render";
import { useSecondLang } from "../../utils/hooks/second-lang";
import { PageTitleBlock } from "./";

vi.mock("../../utils/hooks/second-lang", () => ({
  useSecondLang: vi.fn(),
}));

describe("page-title-bloc", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders one PageTitle only is secondLang is false", () => {
    vi.mocked(useSecondLang).mockReturnValue([false, vi.fn()]);

    const { container } = renderWithAppContext(<PageTitleBlock titleLg1="titleLg1" />);
    expect(container.querySelectorAll("h2")).toHaveLength(1);
    expect(container.querySelectorAll("h2 div")).toHaveLength(0);
  });

  it("renders one PageTitle only if titleLg2 is undefined", () => {
    vi.mocked(useSecondLang).mockReturnValue([true, vi.fn()]);
    const { container } = renderWithAppContext(<PageTitleBlock titleLg1="titleLg1" />);
    expect(container.querySelectorAll("h2")).toHaveLength(1);
    expect(container.querySelectorAll("h2 div")).toHaveLength(0);
  });

  it("renders one PageTitle and one PageSubstitle", () => {
    vi.mocked(useSecondLang).mockReturnValue([true, vi.fn()]);
    const { container } = renderWithAppContext(
      <PageTitleBlock titleLg1="titleLg1" titleLg2="titleLg2" />,
    );
    expect(container.querySelectorAll("h2")).toHaveLength(1);
    expect(container.querySelectorAll("h2 div")).toHaveLength(1);
  });
});
