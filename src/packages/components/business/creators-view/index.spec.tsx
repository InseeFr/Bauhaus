import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import * as organizationsHook from "@utils/hooks/organizations";

import { InseeOrganizationNotes } from "./";

vi.mock("../../i18n", () => ({
  D1: {
    creatorsInput: {
      creatorTitle: "Créateur",
    },
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

describe("InseeOrganizationNotes", () => {
  describe("Label mapping", () => {
    it("should map single organization ID to label", () => {
      using _spy = mockUseOrganizations();
      render(<InseeOrganizationNotes organizations="DG75-L201" />);

      expect(screen.getByText("Créateur")).toBeInTheDocument();
      expect(screen.getByText("INSEE")).toBeInTheDocument();
    });

    it("should map multiple organization IDs to labels", () => {
      using _spy = mockUseOrganizations();
      render(<InseeOrganizationNotes organizations={["DG75-L201", "DG75-G001"]} />);

      expect(screen.getByText("Créateur")).toBeInTheDocument();
      expect(screen.getByText("INSEE")).toBeInTheDocument();
      expect(screen.getByText("Direction Générale")).toBeInTheDocument();

      expect(screen.queryByText("DG75-L201")).not.toBeInTheDocument();
      expect(screen.queryByText("DG75-G001")).not.toBeInTheDocument();
    });

    it("should render nothing for unknown organizations and only display known ones", () => {
      using _spy = mockUseOrganizations();
      const { container } = render(
        <InseeOrganizationNotes organizations={["unknown-123", "DG75-L201"]} />,
      );

      expect(screen.getByText("INSEE")).toBeInTheDocument();
      expect(screen.queryByText("unknown-123")).not.toBeInTheDocument();
      expect(container.querySelectorAll("li")).toHaveLength(2);
    });
  });

  describe("Single organization rendering", () => {
    it("should render single organization label without wrapping it in a list", () => {
      using _spy = mockUseOrganizations();
      const { container } = render(<InseeOrganizationNotes organizations="DG75-L201" />);

      expect(screen.getByText("INSEE")).toBeInTheDocument();
      expect(container.querySelector("ul")).not.toBeInTheDocument();
    });

    it("should render nothing in the body for unknown organization", () => {
      using _spy = mockUseOrganizations();
      const { container } = render(<InseeOrganizationNotes organizations="unknown-id" />);

      expect(screen.getByText("Créateur")).toBeInTheDocument();
      expect(screen.queryByText("unknown-id")).not.toBeInTheDocument();
      expect(container.querySelector("ul")).not.toBeInTheDocument();
    });
  });

  describe("Multiple organizations rendering", () => {
    it("should render multiple organizations as list", () => {
      using _spy = mockUseOrganizations();
      const { container } = render(
        <InseeOrganizationNotes organizations={["DG75-L201", "DG75-L202"]} />,
      );

      expect(container.querySelector("ul")).toBeInTheDocument();
      expect(container.querySelectorAll("li")).toHaveLength(2);
    });

    it("should render mapped labels in list for multiple organizations", () => {
      using _spy = mockUseOrganizations();
      const { container } = render(
        <InseeOrganizationNotes organizations={["DG75-L201", "DG75-L202", "DG75-G001"]} />,
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
        <InseeOrganizationNotes organizations={["DG75-L201", "unknown-org", "DG75-G001"]} />,
      );

      const listItems = container.querySelectorAll("li");
      expect(listItems).toHaveLength(3);
      expect(listItems[0].textContent).toBe("INSEE");
      expect(listItems[1].textContent).toBe("");
      expect(listItems[2].textContent).toBe("Direction Générale");
    });
  });

  describe("Empty values handling", () => {
    it("should render empty note when organizations is undefined", () => {
      using _spy = mockUseOrganizations();
      const { container } = render(<InseeOrganizationNotes organizations={undefined} />);

      expect(screen.getByText("Créateur")).toBeInTheDocument();
      const paragraph = container.querySelector("p");
      expect(paragraph).toBeInTheDocument();
      expect(paragraph?.textContent).toBe("");
    });

    it("should render empty note when organizations is empty array", () => {
      using _spy = mockUseOrganizations();
      const { container } = render(<InseeOrganizationNotes organizations={[]} />);

      expect(screen.getByText("Créateur")).toBeInTheDocument();
      const paragraph = container.querySelector("p");
      expect(paragraph).toBeInTheDocument();
      expect(paragraph?.textContent).toBe("");
    });

    it("should render empty body when organizations are still loading", () => {
      using _spy = vi
        .spyOn(organizationsHook, "useOrganizations")
        .mockReturnValue({ data: undefined } as any);
      const { container } = render(<InseeOrganizationNotes organizations="DG75-L201" />);

      expect(screen.getByText("Créateur")).toBeInTheDocument();
      expect(screen.queryByText("INSEE")).not.toBeInTheDocument();
      expect(container.querySelector("ul")).not.toBeInTheDocument();
    });
  });
});
