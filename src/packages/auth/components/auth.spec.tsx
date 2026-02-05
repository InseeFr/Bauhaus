import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import {
  MODULE,
  MODULES,
  PRIVILEGE,
  PRIVILEGES,
  STRATEGY,
  STRATEGIES,
} from "@utils/hooks/rbac-constants";
import { usePrivileges, useUserStamps } from "@utils/hooks/users";

import { hasAccessToModule, HasAccess } from "./auth";

vi.mock("@utils/hooks/users", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@utils/hooks/users")>();
  return {
    ...actual,
    usePrivileges: vi.fn(),
    useUserStamps: vi.fn(),
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
          application: MODULES.CLASSIFICATION_CLASSIFICATION,
          privileges: [{ privilege: PRIVILEGES.READ, strategy: STRATEGIES.ALL }],
        },
      ],
    });

    (useUserStamps as any).mockReturnValue({ data: [{ stamp: "STAMP1" }] });

    const { container } = render(
      <HasAccess module={MODULES.CLASSIFICATION_CLASSIFICATION} privilege={PRIVILEGES.READ}>
        {DummyChild}
      </HasAccess>,
    );

    expect(container).toHaveTextContent("Authorized content");
  });

  it("renders children when strategy is STAMP and user stamp is included", () => {
    (usePrivileges as any).mockReturnValue({
      privileges: [
        {
          application: MODULES.CLASSIFICATION_CLASSIFICATION,
          privileges: [{ privilege: PRIVILEGES.UPDATE, strategy: STRATEGIES.STAMP }],
        },
      ],
    });

    (useUserStamps as any).mockReturnValue({ data: [{ stamp: "STAMP1" }] });

    const { container } = render(
      <HasAccess
        module={MODULES.CLASSIFICATION_CLASSIFICATION}
        privilege={PRIVILEGES.UPDATE}
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
          application: MODULES.CLASSIFICATION_CLASSIFICATION,
          privileges: [],
        },
      ],
    });

    (useUserStamps as any).mockReturnValue({ data: [{ stamp: "STAMP1" }] });

    const { container } = render(
      <HasAccess module={MODULES.CLASSIFICATION_CLASSIFICATION} privilege={PRIVILEGES.DELETE}>
        {DummyChild}
      </HasAccess>,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("does not render children when STAMP strategy fails complementary check", () => {
    (usePrivileges as any).mockReturnValue({
      privileges: [
        {
          application: MODULES.CLASSIFICATION_CLASSIFICATION,
          privileges: [{ privilege: PRIVILEGES.UPDATE, strategy: STRATEGIES.STAMP }],
        },
      ],
    });

    (useUserStamps as any).mockReturnValue({ data: [{ stamp: "STAMP1" }] });

    const { container } = render(
      <HasAccess
        module={MODULES.CLASSIFICATION_CLASSIFICATION}
        privilege={PRIVILEGES.UPDATE}
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
    (useUserStamps as any).mockReturnValue({ data: [{ stamp: "STAMP1" }] });

    const { container } = render(
      <HasAccess module={MODULES.CLASSIFICATION_CLASSIFICATION} privilege={PRIVILEGES.READ}>
        {DummyChild}
      </HasAccess>,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("does not render children when user stamp is not in allowed stamps", () => {
    (usePrivileges as any).mockReturnValue({
      privileges: [
        {
          application: MODULES.CLASSIFICATION_CLASSIFICATION,
          privileges: [{ privilege: PRIVILEGES.UPDATE, strategy: STRATEGIES.STAMP }],
        },
      ],
    });

    (useUserStamps as any).mockReturnValue({ data: [{ stamp: "STAMP3" }] });

    const { container } = render(
      <HasAccess
        module={MODULES.CLASSIFICATION_CLASSIFICATION}
        privilege={PRIVILEGES.UPDATE}
        stamps={["STAMP1", "STAMP2"]}
      >
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
    const privileges = [makePrivilege(MODULES.CONCEPT_CONCEPT, STRATEGIES.NONE)];
    expect(hasAccessToModule("concepts", privileges)).toBe(false);
  });

  it("returns true if at least one privilege has strategy !== NONE", () => {
    const privileges = [makePrivilege(MODULES.CONCEPT_CONCEPT, STRATEGIES.ALL)];
    expect(hasAccessToModule("concepts", privileges)).toBe(true);
  });

  it("returns true if multiple privileges and one matches with non-NONE strategy", () => {
    const privileges = [
      makePrivilege(MODULES.CONCEPT_CONCEPT, STRATEGIES.NONE),
      makePrivilege(MODULES.CONCEPT_CONCEPT, STRATEGIES.ALL),
    ];
    expect(hasAccessToModule("concepts", privileges)).toBe(true);
  });

  it("returns false for unknown module", () => {
    const privileges = [makePrivilege(MODULES.CONCEPT_CONCEPT, STRATEGIES.ALL)];
    // @ts-expect-error test invalid input
    expect(hasAccessToModule("unknownModule", privileges)).toBe(false);
  });

  it("uses prefix matching", () => {
    const privileges = [makePrivilege(MODULES.CONCEPT_CONCEPT, STRATEGIES.ALL)];
    expect(hasAccessToModule("concepts", privileges)).toBe(true);
  });

  it("returns false if prefix does not match module", () => {
    const privileges = [makePrivilege(MODULES.STRUCTURE_STRUCTURE, STRATEGIES.ALL)];
    expect(hasAccessToModule("concepts", privileges)).toBe(false);
  });
});
