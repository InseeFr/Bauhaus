import { render, waitFor } from "@testing-library/react";

import { getBaseURI } from "../../../sdk";
import OperationsDocumentationVisualization from "./home";

vi.mock("../../../sdk", () => ({
  getBaseURI: vi.fn().mockResolvedValue("http://base-uri"),
}));

const document = {
  descriptionLg1: "descriptionLg1",
  descriptionLg2: "descriptionLg2",
  uri: "uri/page/1",
  url: "url",
  updatedDate: "2019/02/01",
  sims: [],
};

const renderAndWait = async (component) => {
  const result = render(component);
  await waitFor(() => {
    expect(getBaseURI).toHaveBeenCalled();
  });
  return result;
};

describe("OperationsDocumentationVisualization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display by default three notes", async () => {
    const { container } = await renderAndWait(
      <OperationsDocumentationVisualization secondLang={false} attr={document} />,
    );
    const notes = container.querySelectorAll(".note");
    expect(notes).toHaveLength(4);

    expect(notes[0].innerHTML).toContain(document.descriptionLg1);

    const a = notes[1].querySelector("a");
    expect(a).toBeDefined();
    expect(a.href).toContain(document.url);
    expect(a).toHaveAttribute("rel", "noreferrer noopener");
    expect(a).toHaveAttribute("target", "_blank");
    expect(a.innerHTML).toContain(document.url);
  });

  it("should display a note if the secondLang flag is true", async () => {
    const { container } = await renderAndWait(
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
    const { container } = await renderAndWait(
      <OperationsDocumentationVisualization attr={d} secondLang={true} />,
    );
    const notes = container.querySelectorAll(".note");
    expect(notes).toHaveLength(7);
  });

  it("should not display the date if this one is not valid", async () => {
    const d = {
      ...document,
      uri: "/document/page/1",
      updatedDate: undefined,
    };
    const { container } = await renderAndWait(
      <OperationsDocumentationVisualization attr={d} secondLang={true} />,
    );
    const date = container.querySelector(".row:nth-child(2) .card-body");
    expect(date).toBeEmptyDOMElement();
  });
});
