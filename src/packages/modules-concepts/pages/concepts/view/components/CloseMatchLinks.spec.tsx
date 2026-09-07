import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Link } from "@model/concepts/concept";

import { CloseMatchLinks } from "./CloseMatchLinks";

const mockLinks = [
  { urn: "http://example.com/link1" },
  { urn: "http://example.com/link2" },
] as Link[];

const mockDictionnary = {
  equivalentTitle: "Equivalent links",
};

describe("CloseMatchLinks", () => {
  it("renders the equivalent links when links are provided", () => {
    render(<CloseMatchLinks links={mockLinks} Dictionnary={mockDictionnary} />);

    screen.getByText(/Equivalent links/);

    const items = screen.queryAllByRole("listitem");
    expect(items).toHaveLength(mockLinks.length + 1);

    mockLinks.forEach((link) => {
      const linkElement = screen.getByText(link.urn);
      expect(linkElement.getAttribute("href")).toBe(link.urn);
      expect(linkElement.getAttribute("target")).toBe("_blank");
      expect(linkElement.getAttribute("rel")).toBe("noreferrer noopener");
    });
  });

  it("does not render anything when no links are provided", () => {
    render(<CloseMatchLinks links={[]} Dictionnary={mockDictionnary} />);

    const items = screen.queryAllByRole("listitem");
    expect(items).toHaveLength(0);
  });
});
