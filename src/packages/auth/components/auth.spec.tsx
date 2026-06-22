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

  it("renders children when an allowed stamp is a URI ending with the user stamp", () => {
    (usePrivileges as any).mockReturnValue({
      privileges: [
        {
          application: MODULES.CLASSIFICATION_CLASSIFICATION,
          privileges: [{ privilege: PRIVILEGES.UPDATE, strategy: STRATEGIES.STAMP }],
        },
      ],
    });

    (useUserStamps as any).mockReturnValue({ data: [{ stamp: "DG75-L201" }] });

    const { container } = render(
      <HasAccess
        module={MODULES.CLASSIFICATION_CLASSIFICATION}
        privilege={PRIVILEGES.UPDATE}
        stamps={["http://bauhaus.insee.fr/organisations/insee/DG75-L201"]}
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

describe("<HasAccess /> — stratégie STAMP sans prop stamps", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const stampUpdatePrivilege = {
    application: MODULES.CLASSIFICATION_CLASSIFICATION,
    privileges: [{ privilege: PRIVILEGES.UPDATE, strategy: STRATEGIES.STAMP }],
  };

  // Non-régression : un module peut câbler son gating STAMP via un `check`
  // métier sans passer `stamps` (cf. modules-operations/document). Ce cas
  // doit continuer de fonctionner après le correctif.
  it("non-régression : rend les enfants avec un check passant et sans prop stamps", () => {
    (usePrivileges as any).mockReturnValue({ privileges: [stampUpdatePrivilege] });
    (useUserStamps as any).mockReturnValue({ data: [{ stamp: "STAMP1" }] });

    const { container } = render(
      <HasAccess
        module={MODULES.CLASSIFICATION_CLASSIFICATION}
        privilege={PRIVILEGES.UPDATE}
        check={() => true}
      >
        {DummyChild}
      </HasAccess>,
    );

    expect(container).toHaveTextContent("Authorized content");
  });

  it("non-régression : masque les enfants avec un check rejetant et sans prop stamps", () => {
    (usePrivileges as any).mockReturnValue({ privileges: [stampUpdatePrivilege] });
    (useUserStamps as any).mockReturnValue({ data: [{ stamp: "STAMP1" }] });

    const { container } = render(
      <HasAccess
        module={MODULES.CLASSIFICATION_CLASSIFICATION}
        privilege={PRIVILEGES.UPDATE}
        check={() => false}
      >
        {DummyChild}
      </HasAccess>,
    );

    expect(container).toBeEmptyDOMElement();
  });

  // Comportement corrigé : sans `stamps` ni `check`, la stratégie STAMP
  // n'est pas réellement appliquée — on masque plutôt que d'ouvrir l'accès
  // à tout utilisateur tamponné.
  it("masque les enfants en stratégie STAMP sans stamps ni check, même pour un utilisateur tamponné", () => {
    (usePrivileges as any).mockReturnValue({ privileges: [stampUpdatePrivilege] });
    (useUserStamps as any).mockReturnValue({ data: [{ stamp: "STAMP1" }] });

    const { container } = render(
      <HasAccess module={MODULES.CLASSIFICATION_CLASSIFICATION} privilege={PRIVILEGES.UPDATE}>
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
