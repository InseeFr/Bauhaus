import { render, screen } from "@testing-library/react";

import { Document } from "@model/operations/document";

import { OperationsDocumentationVisualization } from "./OperationsDocumentationVisualization";

vi.mock("../../../../../sdk", () => ({
  getBaseURI: vi.fn().mockReturnValue("http://base-uri"),
}));

const document = {
  descriptionLg1: "descriptionLg1",
  descriptionLg2: "descriptionLg2",
  uri: "uri/page/1",
  url: "url",
  updatedDate: "2019/02/01",
  sims: [],
} as unknown as Document;

describe("OperationsDocumentationVisualization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display by default three notes", async () => {
    const { container } = render(
      <OperationsDocumentationVisualization secondLang={false} attr={document} />,
    );
    const notes = container.querySelectorAll(".note");
    expect(notes).toHaveLength(4);

    expect(notes[0].innerHTML).toContain(document.descriptionLg1);

    const a = notes[1].querySelector("a") as HTMLAnchorElement;
    expect(a).toBeDefined();
    expect(a.href).toContain(document.url);
    expect(a).toHaveAttribute("rel", "noreferrer noopener");
    expect(a).toHaveAttribute("target", "_blank");
    expect(a.innerHTML).toContain(document.url);
  });

  it("should display a note if the secondLang flag is true", async () => {
    const { container } = render(
      <OperationsDocumentationVisualization attr={document} secondLang={true} />,
    );
    const notes = container.querySelectorAll(".note");

    expect(notes).toHaveLength(6);

    expect(notes[0].innerHTML).toContain(document.descriptionLg1);
    expect(notes[1].innerHTML).toContain(document.descriptionLg2);
  });

  it("should display a note if the object is a document", async () => {
    const d = {
      ...document,
      uri: "/document/uri",
    };
    const { container } = render(
      <OperationsDocumentationVisualization attr={d} secondLang={true} />,
    );
    const notes = container.querySelectorAll(".note");
    expect(notes).toHaveLength(7);
  });

  it("should display the size of the file on the right of the download link", async () => {
    const d = { ...document, uri: "/document/uri", labelLg1: "Note technique", size: 130048 };
    render(<OperationsDocumentationVisualization attr={d} secondLang={false} />);

    const link = screen.getByRole("link", { name: "Note technique" });
    const size = screen.getByText("(130 kB)");
    expect(link.nextElementSibling).toContainElement(size);
    expect(size).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("130 kilobytes")).toHaveClass("sr-only");
  });

  it("should not display any size when the file size is unknown", async () => {
    const d = { ...document, uri: "/document/uri", labelLg1: "Note technique" };
    render(<OperationsDocumentationVisualization attr={d} secondLang={false} />);

    expect(screen.getByRole("link", { name: "Note technique" }).nextElementSibling).toBeNull();
  });

  it("should not display the date if this one is not valid", async () => {
    const d = {
      ...document,
      uri: "/document/page/1",
      updatedDate: undefined,
    };
    const { container } = render(
      <OperationsDocumentationVisualization attr={d} secondLang={true} />,
    );
    const date = container.querySelector(".row:nth-child(2) .card-body");
    expect(date).toBeEmptyDOMElement();
  });
});
