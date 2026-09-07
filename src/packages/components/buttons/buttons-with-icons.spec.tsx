import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import {
  CompareButton,
  UpdateButton,
  DeleteButton,
  PublishButton,
  ReturnButton,
  ExportButton,
  TreeButton,
} from "./buttons-with-icons";

const withRouter = (ui: React.ReactElement) => <MemoryRouter>{ui}</MemoryRouter>;

describe("UpdateButton", () => {
  it("renders with the correct label", () => {
    render(withRouter(<UpdateButton action={vi.fn<() => void>()} />));
    expect(screen.getByText("Update")).toBeInTheDocument();
  });

  it("renders an SVG icon", () => {
    const { container } = render(withRouter(<UpdateButton action={vi.fn<() => void>()} />));
    expect(container.querySelector("svg")).not.toBeNull();
  });
});

describe("CompareButton", () => {
  it("renders with the correct label", () => {
    render(withRouter(<CompareButton action={vi.fn<() => void>()} />));
    expect(screen.getByText("Compare")).toBeInTheDocument();
  });

  it("renders an SVG icon", () => {
    const { container } = render(withRouter(<CompareButton action={vi.fn<() => void>()} />));
    expect(container.querySelector("svg")).not.toBeNull();
  });
});

describe("DeleteButton", () => {
  it("renders with the correct label", () => {
    render(withRouter(<DeleteButton action={vi.fn<() => void>()} />));
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("renders an SVG icon", () => {
    const { container } = render(withRouter(<DeleteButton action={vi.fn<() => void>()} />));
    expect(container.querySelector("svg")).not.toBeNull();
  });
});

describe("PublishButton", () => {
  it("renders with the correct label", () => {
    render(withRouter(<PublishButton action={vi.fn<() => void>()} />));
    expect(screen.getByText("Publish")).toBeInTheDocument();
  });

  it("renders an SVG icon", () => {
    const { container } = render(withRouter(<PublishButton action={vi.fn<() => void>()} />));
    expect(container.querySelector("svg")).not.toBeNull();
  });
});

describe("ReturnButton", () => {
  it("renders with the default label", () => {
    render(withRouter(<ReturnButton action={vi.fn<() => void>()} />));
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("renders with a custom label when provided", () => {
    render(
      withRouter(<ReturnButton label="Back to current version" action={vi.fn<() => void>()} />),
    );
    expect(screen.getByText("Back to current version")).toBeInTheDocument();
  });

  it("renders an SVG icon", () => {
    const { container } = render(withRouter(<ReturnButton action={vi.fn<() => void>()} />));
    expect(container.querySelector("svg")).not.toBeNull();
  });
});

describe("ExportButton", () => {
  it("renders with the correct label", () => {
    render(withRouter(<ExportButton action={vi.fn<() => void>()} />));
    expect(screen.getByText("Export")).toBeInTheDocument();
  });

  it("renders an SVG icon", () => {
    const { container } = render(withRouter(<ExportButton action={vi.fn<() => void>()} />));
    expect(container.querySelector("svg")).not.toBeNull();
  });
});

describe("TreeButton", () => {
  it("renders with the default label", () => {
    render(withRouter(<TreeButton action={vi.fn<() => void>()} />));
    expect(screen.getByText("View tree")).toBeInTheDocument();
  });

  it("renders with a custom label when provided", () => {
    render(
      withRouter(<TreeButton label="View the classification tree" action={vi.fn<() => void>()} />),
    );
    expect(screen.getByText("View the classification tree")).toBeInTheDocument();
  });

  it("renders an SVG icon", () => {
    const { container } = render(withRouter(<TreeButton action={vi.fn<() => void>()} />));
    expect(container.querySelector("svg")).not.toBeNull();
  });
});
