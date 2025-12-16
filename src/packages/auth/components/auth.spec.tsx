import { render } from "@testing-library/react";
import { useSelector } from "react-redux";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { MODULE, PRIVILEGE, STRATEGY, usePrivileges } from "@utils/hooks/users";

import { hasAccessToModule, HasAccess } from "./auth";

vi.mock("@utils/hooks/users", () => ({
  usePrivileges: vi.fn(),
}));

vi.mock("react-redux", async () => {
  const actual = await vi.importActual<typeof import("react-redux")>("react-redux");
  return {
    ...actual,
    useSelector: vi.fn(),
  };
});

const DummyChild = <div>Authorized content</div>;

describe("<HasAccess />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children when strategy is ALL", () => {
    (usePrivileges as any).mockReturnValue({
      privileges: [
        {
          application: "CLASSIFICATION_CLASSIFICATION",
          privileges: [{ privilege: "READ", strategy: "ALL" }],
        },
      ],
    });

    (useSelector as any).mockReturnValue({ stamp: "STAMP1" });

    const { container } = render(
      <HasAccess module="CLASSIFICATION_CLASSIFICATION" privilege="READ">
        {DummyChild}
      </HasAccess>,
    );

    expect(container).toHaveTextContent("Authorized content");
  });

  it("renders children when strategy is STAMP and user stamp is included", () => {
    (usePrivileges as any).mockReturnValue({
      privileges: [
        {
          application: "CLASSIFICATION_CLASSIFICATION",
          privileges: [{ privilege: "WRITE", strategy: "STAMP" }],
        },
      ],
    });

    (useSelector as any).mockReturnValue({ stamp: "STAMP1" });

    const { container } = render(
      <HasAccess
        module="CLASSIFICATION_CLASSIFICATION"
        privilege="WRITE"
        stamps={["STAMP1", "STAMP2"]}
        check={() => true}
      >
        {DummyChild}
      </HasAccess>,
    );

    expect(container).toHaveTextContent("Authorized content");
  });

  it("does not render children when no privilege found", () => {
    (usePrivileges as any).mockReturnValue({
      privileges: [
        {
          application: "CLASSIFICATION_CLASSIFICATION",
          privileges: [],
        },
      ],
    });

    (useSelector as any).mockReturnValue({ stamp: "STAMP1" });

    const { container } = render(
      <HasAccess module="CLASSIFICATION_CLASSIFICATION" privilege="DELETE">
        {DummyChild}
      </HasAccess>,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("does not render children when STAMP strategy fails complementary check", () => {
    (usePrivileges as any).mockReturnValue({
      privileges: [
        {
          application: "CLASSIFICATION_CLASSIFICATION",
          privileges: [{ privilege: "WRITE", strategy: "STAMP" }],
        },
      ],
    });

    (useSelector as any).mockReturnValue({ stamp: "STAMP1" });

    const { container } = render(
      <HasAccess
        module="CLASSIFICATION_CLASSIFICATION"
        privilege="WRITE"
        stamps={["STAMP1"]}
        check={() => false}
      >
        {DummyChild}
      </HasAccess>,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("does not render children if privileges are undefined", () => {
    (usePrivileges as any).mockReturnValue({ privileges: undefined });
    (useSelector as any).mockReturnValue({ stamp: "STAMP1" });

    const { container } = render(
      <HasAccess module="CLASSIFICATION_CLASSIFICATION" privilege="READ">
        {DummyChild}
      </HasAccess>,
    );

    expect(container).toBeEmptyDOMElement();
  });
});

describe("hasAccessToModule", () => {
  const makePrivilege = (
    application: MODULE,
    strategy: STRATEGY,
  ): {
    application: MODULE;
    privileges: { privilege: PRIVILEGE; strategy: STRATEGY }[];
  } => ({
    application,
    privileges: [{ privilege: "CREATE", strategy }],
  });

  it("returns false if privileges is undefined", () => {
    expect(hasAccessToModule("concepts", undefined)).toBe(false);
  });

  it("returns false if privileges is empty", () => {
    expect(hasAccessToModule("concepts", [])).toBe(false);
  });

  it("returns false if no privilege with strategy !== NONE", () => {
    const privileges = [makePrivilege("CONCEPT_CONCEPT", "NONE")];
    expect(hasAccessToModule("concepts", privileges)).toBe(false);
  });

  it("returns true if at least one privilege has strategy !== NONE", () => {
    const privileges = [makePrivilege("CONCEPT_CONCEPT", "ALL")];
    expect(hasAccessToModule("concepts", privileges)).toBe(true);
  });

  it("returns true if multiple privileges and one matches with non-NONE strategy", () => {
    const privileges = [
      makePrivilege("CONCEPT_CONCEPT", "NONE"),
      makePrivilege("CONCEPT_CONCEPT", "ALL"),
    ];
    expect(hasAccessToModule("concepts", privileges)).toBe(true);
  });

  it("returns false for unknown module", () => {
    const privileges = [makePrivilege("CONCEPT_CONCEPT", "ALL")];
    // @ts-expect-error test invalid input
    expect(hasAccessToModule("unknownModule", privileges)).toBe(false);
  });

  it("uses prefix matching", () => {
    const privileges = [makePrivilege("CONCEPT_CONCEPT", "ALL")];
    expect(hasAccessToModule("concepts", privileges)).toBe(true);
  });

  it("returns false if prefix does not match module", () => {
    const privileges = [makePrivilege("STRUCTURE_STRUCTURE", "ALL")];
    expect(hasAccessToModule("concepts", privileges)).toBe(false);
  });
});
