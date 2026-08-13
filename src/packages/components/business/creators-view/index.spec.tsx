import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import * as organizationsHook from "../../../utils/hooks/organizations";
import { InseeOrganisationNotes } from "./";

vi.mock("../../../i18n", () => ({
  D1: {
    creatorTitle: "Créateur",
  },
}));

const organizations = [
  { iri: "DG75-L201", label: "INSEE" },
  { iri: "DG75-L202", label: "DARES" },
  { iri: "DG75-G001", label: "Direction Générale" },
  { iri: "id", label: "Label for id" },
  { iri: "id2", label: "Label for id2" },
];

const mockUseOrganizations = (data: unknown = organizations) =>
  vi.spyOn(organizationsHook, "useOrganizations").mockReturnValue({ data } as any);

describe("InseeOrganisationNotes", () => {
  describe("Label mapping", () => {
    it("should map single organisation ID to label", () => {
      using _spy = mockUseOrganizations();
      render(<InseeOrganisationNotes organisations="DG75-L201" />);

      expect(screen.getByText("Créateur")).toBeInTheDocument();
      expect(screen.getByText("INSEE")).toBeInTheDocument();
    });

    it("should map multiple organisation IDs to labels", () => {
      using _spy = mockUseOrganizations();
      render(<InseeOrganisationNotes organisations={["DG75-L201", "DG75-G001"]} />);

      expect(screen.getByText("Créateur")).toBeInTheDocument();
      expect(screen.getByText("INSEE")).toBeInTheDocument();
      expect(screen.getByText("Direction Générale")).toBeInTheDocument();

      expect(screen.queryByText("DG75-L201")).not.toBeInTheDocument();
      expect(screen.queryByText("DG75-G001")).not.toBeInTheDocument();
    });

    it("should render nothing for unknown organisations and only display known ones", () => {
      using _spy = mockUseOrganizations();
      const { container } = render(
        <InseeOrganisationNotes organisations={["unknown-123", "DG75-L201"]} />,
      );

      expect(screen.getByText("INSEE")).toBeInTheDocument();
      expect(screen.queryByText("unknown-123")).not.toBeInTheDocument();
      expect(container.querySelectorAll("li")).toHaveLength(2);
    });
  });

  describe("Single organisation rendering", () => {
    it("should render single organisation label without wrapping it in a list", () => {
      using _spy = mockUseOrganizations();
      const { container } = render(<InseeOrganisationNotes organisations="DG75-L201" />);

      expect(screen.getByText("INSEE")).toBeInTheDocument();
      expect(container.querySelector("ul")).not.toBeInTheDocument();
    });

    it("should render nothing in the body for unknown organisation", () => {
      using _spy = mockUseOrganizations();
      const { container } = render(<InseeOrganisationNotes organisations="unknown-id" />);

      expect(screen.getByText("Créateur")).toBeInTheDocument();
      expect(screen.queryByText("unknown-id")).not.toBeInTheDocument();
      expect(container.querySelector("ul")).not.toBeInTheDocument();
    });
  });

  describe("Multiple organisations rendering", () => {
    it("should render multiple organisations as list", () => {
      using _spy = mockUseOrganizations();
      const { container } = render(
        <InseeOrganisationNotes organisations={["DG75-L201", "DG75-L202"]} />,
      );

      expect(container.querySelector("ul")).toBeInTheDocument();
      expect(container.querySelectorAll("li")).toHaveLength(2);
    });

    it("should render mapped labels in list for multiple organisations", () => {
      using _spy = mockUseOrganizations();
      const { container } = render(
        <InseeOrganisationNotes organisations={["DG75-L201", "DG75-L202", "DG75-G001"]} />,
      );

      const listItems = container.querySelectorAll("li");
      expect(listItems).toHaveLength(3);
      expect(listItems[0].textContent).toBe("INSEE");
      expect(listItems[1].textContent).toBe("DARES");
      expect(listItems[2].textContent).toBe("Direction Générale");
    });

    it("should handle mix of known and unknown IDs in list", () => {
      using _spy = mockUseOrganizations();
      const { container } = render(
        <InseeOrganisationNotes organisations={["DG75-L201", "unknown-org", "DG75-G001"]} />,
      );

      const listItems = container.querySelectorAll("li");
      expect(listItems).toHaveLength(3);
      expect(listItems[0].textContent).toBe("INSEE");
      expect(listItems[1].textContent).toBe("");
      expect(listItems[2].textContent).toBe("Direction Générale");
    });
  });

  describe("Empty values handling", () => {
    it("should render empty note when organisations is undefined", () => {
      using _spy = mockUseOrganizations();
      const { container } = render(<InseeOrganisationNotes organisations={undefined} />);

      expect(screen.getByText("Créateur")).toBeInTheDocument();
      const paragraph = container.querySelector("p");
      expect(paragraph).toBeInTheDocument();
      expect(paragraph?.textContent).toBe("");
    });

    it("should render empty note when organisations is empty array", () => {
      using _spy = mockUseOrganizations();
      const { container } = render(<InseeOrganisationNotes organisations={[]} />);

      expect(screen.getByText("Créateur")).toBeInTheDocument();
      const paragraph = container.querySelector("p");
      expect(paragraph).toBeInTheDocument();
      expect(paragraph?.textContent).toBe("");
    });

    it("should render empty body when organizations are still loading", () => {
      using _spy = vi
        .spyOn(organizationsHook, "useOrganizations")
        .mockReturnValue({ data: undefined } as any);
      const { container } = render(<InseeOrganisationNotes organisations="DG75-L201" />);

      expect(screen.getByText("Créateur")).toBeInTheDocument();
      expect(screen.queryByText("INSEE")).not.toBeInTheDocument();
      expect(container.querySelector("ul")).not.toBeInTheDocument();
    });
  });
});
