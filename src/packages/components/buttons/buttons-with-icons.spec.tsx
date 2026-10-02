import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

import {
  CloseIconButton,
  CompareButton,
  UpdateButton,
  DeleteButton,
  PublishButton,
  ReturnButton,
  ExportButton,
  TreeButton,
} from "./buttons-with-icons";

const withRouter = (ui: React.ReactElement) => <MemoryRouter>{ui}</MemoryRouter>;

describe("CloseIconButton", () => {
  it("renders an icon-only PrimeReact button named Close", () => {
    const onClick = vi.fn<() => void>();
    render(<CloseIconButton onClick={onClick} />);

    const button = screen.getByRole("button", { name: "Close" });
    expect(button).toHaveClass("p-button", "p-button-icon-only");
    expect(button).not.toHaveClass("close");

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("UpdateButton", () => {
  it("renders a PrimeReact button", () => {
    render(withRouter(<UpdateButton action={vi.fn<() => void>()} />));
    expect(screen.getByRole("button", { name: "Update" })).toHaveClass("p-button");
  });

  it("renders with the correct label", () => {
    render(withRouter(<UpdateButton action={vi.fn<() => void>()} />));
    expect(screen.getByText("Update")).toBeInTheDocument();
  });

  it("renders a single SVG icon", () => {
    const { container } = render(withRouter(<UpdateButton action={vi.fn<() => void>()} />));
    expect(container.querySelectorAll("svg")).toHaveLength(1);
  });
});

describe("CompareButton", () => {
  it("renders with the correct label", () => {
    render(withRouter(<CompareButton action={vi.fn<() => void>()} />));
    expect(screen.getByText("Compare")).toBeInTheDocument();
  });

  it("renders a single SVG icon", () => {
    const { container } = render(withRouter(<CompareButton action={vi.fn<() => void>()} />));
    expect(container.querySelectorAll("svg")).toHaveLength(1);
  });
});

describe("DeleteButton", () => {
  it("renders with the correct label", () => {
    render(withRouter(<DeleteButton action={vi.fn<() => void>()} />));
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("renders a single SVG icon", () => {
    const { container } = render(withRouter(<DeleteButton action={vi.fn<() => void>()} />));
    expect(container.querySelectorAll("svg")).toHaveLength(1);
  });
});

describe("PublishButton", () => {
  it("renders with the correct label", () => {
    render(withRouter(<PublishButton action={vi.fn<() => void>()} />));
    expect(screen.getByText("Publish")).toBeInTheDocument();
  });

  it("renders a single SVG icon", () => {
    const { container } = render(withRouter(<PublishButton action={vi.fn<() => void>()} />));
    expect(container.querySelectorAll("svg")).toHaveLength(1);
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

  it("renders a single SVG icon", () => {
    const { container } = render(withRouter(<ReturnButton action={vi.fn<() => void>()} />));
    expect(container.querySelectorAll("svg")).toHaveLength(1);
  });
});

describe("ExportButton", () => {
  it("renders with the correct label", () => {
    render(withRouter(<ExportButton action={vi.fn<() => void>()} />));
    expect(screen.getByText("Export")).toBeInTheDocument();
  });

  it("renders a single SVG icon", () => {
    const { container } = render(withRouter(<ExportButton action={vi.fn<() => void>()} />));
    expect(container.querySelectorAll("svg")).toHaveLength(1);
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

  it("renders a single SVG icon", () => {
    const { container } = render(withRouter(<TreeButton action={vi.fn<() => void>()} />));
    expect(container.querySelectorAll("svg")).toHaveLength(1);
  });
});
