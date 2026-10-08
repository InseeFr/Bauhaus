import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { SharedVariableNotice } from "./SharedVariableNotice";

vi.mock("react-i18next", () => import("../../../i18n.testing"));
vi.mock("react-router", () => import("../CodeRepresentation/reactRouter.testing"));

const fichier2025 = { agency: "fr.insee", id: "pi-2025", label: "Fichier 2025" };
const fichier2026 = { agency: "fr.insee", id: "pi-2026", label: "Fichier 2026" };
const NO_OTHER_PHYSICAL_INSTANCES: (typeof fichier2025)[] = [];
const fichiers2025Et2026 = [fichier2025, fichier2026];
const fichier2025Seul = [fichier2025];

describe("SharedVariableNotice", () => {
  it("renders nothing when the variable belongs to this physical instance alone", () => {
    const { container } = render(
      <SharedVariableNotice otherPhysicalInstances={NO_OTHER_PHYSICAL_INSTANCES} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("warns that editing the variable updates the other physical instances that use it", () => {
    render(<SharedVariableNotice otherPhysicalInstances={fichiers2025Et2026} />);

    expect(
      screen.getByText('physicalInstance.view.sharedVariable.message|{"count":2}'),
    ).toBeInTheDocument();
  });

  it("links each impacted physical instance to its page", () => {
    render(<SharedVariableNotice otherPhysicalInstances={fichiers2025Et2026} />);

    expect(screen.getByRole("link", { name: "Fichier 2025" })).toHaveAttribute(
      "href",
      "/ddi/physical-instances/fr.insee/pi-2025",
    );
    expect(screen.getByRole("link", { name: "Fichier 2026" })).toHaveAttribute(
      "href",
      "/ddi/physical-instances/fr.insee/pi-2026",
    );
  });

  it("stays out of the accessibility tree as an alert, being a permanent reminder", () => {
    render(<SharedVariableNotice otherPhysicalInstances={fichier2025Seul} />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
