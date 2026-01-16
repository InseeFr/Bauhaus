import { setDocumentTitle } from "./useTitle";

describe("setDocumentTitle", () => {
  beforeEach(() => {
    document.title = "";
  });

  it("should set document title with page, application, and default Bauhaus", () => {
    setDocumentTitle("MyApp", "Home");
    expect(document.title).toBe("Home - MyApp - Bauhaus");
  });

  it("should set document title with only application and default Bauhaus when page is undefined", () => {
    setDocumentTitle("MyApp");
    expect(document.title).toBe("MyApp - Bauhaus");
  });

  it("should set document title with only page and default Bauhaus when application is undefined", () => {
    setDocumentTitle(undefined, "Home");
    expect(document.title).toBe("Home - Bauhaus");
  });

  it("should set document title with only default Bauhaus when both page and application are undefined", () => {
    setDocumentTitle();
    expect(document.title).toBe("Bauhaus");
  });

  it("should handle empty strings for page and application", () => {
    setDocumentTitle("", "");
    expect(document.title).toBe("Bauhaus");
  });
});
