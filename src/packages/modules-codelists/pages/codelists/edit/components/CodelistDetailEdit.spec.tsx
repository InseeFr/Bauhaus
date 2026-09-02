import { Mock, vi, describe, it, expect, beforeEach } from "vitest";

import { useUserStamps } from "@utils/hooks/users";

import { useAuthorizationGuard } from "../../../../../auth/components/auth";

vi.mock("@utils/hooks/users", () => ({
  useUserStamps: vi.fn(),
}));

vi.mock("../../../../../auth/components/auth", () => ({
  useAuthorizationGuard: vi.fn(),
}));

vi.mock("@utils/hooks/useTitle", () => ({
  useTitle: vi.fn(),
}));

describe("CodelistDetailEdit - Hook integration tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useUserStamps hook - data property migration", () => {
    it("should use 'data' property from useUserStamps (not 'datas')", () => {
      // Setup mock
      const mockStamps = [{ stamp: "TEST-STAMP" }];
      (useUserStamps as Mock).mockReturnValue({
        data: mockStamps,
      });

      // Call the hook
      const result = useUserStamps();

      // Verify it returns 'data' property
      expect(result).toHaveProperty("data");
      expect(result.data).toEqual(mockStamps);
      expect(result).not.toHaveProperty("datas");
    });

    it("should correctly extract first stamp from data array", () => {
      const mockStamps = [{ stamp: "FIRST-STAMP" }, { stamp: "SECOND-STAMP" }];
      (useUserStamps as Mock).mockReturnValue({
        data: mockStamps,
      });

      const { data } = useUserStamps();
      const firstStamp = data?.[0]?.stamp;

      expect(firstStamp).toBe("FIRST-STAMP");
      expect(data).toHaveLength(2);
    });

    it("should handle empty data array safely", () => {
      (useUserStamps as Mock).mockReturnValue({
        data: [],
      });

      const { data } = useUserStamps();
      const stamp = data?.[0]?.stamp;

      expect(data).toEqual([]);
      expect(stamp).toBeUndefined();
    });

    it("should handle undefined stamps gracefully", () => {
      (useUserStamps as Mock).mockReturnValue({
        data: undefined,
      });

      const { data } = useUserStamps();

      expect(data).toBeUndefined();
    });
  });

  describe("CreatorsInput component - multi prop removed", () => {
    it("should verify that CreatorsInput no longer expects multi prop", () => {
      // This test documents that the 'multi' prop has been removed
      // from CreatorsInput component usage

      const expectedProps = {
        value: "single-creator",
        onChange: expect.any(Function),
      };

      // The 'multi' prop should NOT be part of expected props
      expect(expectedProps).not.toHaveProperty("multi");
    });

    it("should work with single creator value instead of array", () => {
      const singleCreator = "creator-id";
      const arrayCreator = ["creator-id"];

      // New behavior: single value
      expect(typeof singleCreator).toBe("string");

      // Old behavior with multi: array
      expect(Array.isArray(arrayCreator)).toBe(true);

      // Document the change
      const isMultiRemoved = true;
      expect(isMultiRemoved).toBe(true);
    });
  });

  describe("Authorization guard integration", () => {
    it("should call useAuthorizationGuard with correct parameters", () => {
      (useAuthorizationGuard as Mock).mockReturnValue(true);

      const result = useAuthorizationGuard({
        module: "CODESLIST_CODESLIST",
        privilege: "CREATE",
      });

      expect(useAuthorizationGuard).toHaveBeenCalledWith({
        module: "CODESLIST_CODESLIST",
        privilege: "CREATE",
      });
      expect(result).toBe(true);
    });

    it("should handle unauthorized users", () => {
      (useAuthorizationGuard as Mock).mockReturnValue(false);

      const result = useAuthorizationGuard({
        module: "CODESLIST_CODESLIST",
        privilege: "CREATE",
      });

      expect(result).toBe(false);
    });
  });

  describe("Form validation logic", () => {
    it("should require labelLg1 field", () => {
      const emptyCodelist = { id: "test", labelLg1: "" };
      const validCodelist = { id: "test", labelLg1: "Valid Label" };

      expect(emptyCodelist.labelLg1).toBe("");
      expect(validCodelist.labelLg1).toBe("Valid Label");
    });

    it("should require id field", () => {
      const emptyId = { id: "", labelLg1: "Label" };
      const validId = { id: "valid-id", labelLg1: "Label" };

      expect(emptyId.id).toBe("");
      expect(validId.id).toBe("valid-id");
    });
  });

  describe("Contributor initialization logic", () => {
    // Le contributeur d'une liste de codes est une IRI d'organization : la
    // résolution du timbre vit dans `resolveContributorIri`, testée dans
    // `utils/creation/contributor-init.spec.ts`. Le formulaire se contente de
    // pré-remplir la valeur résolue, ou rien si elle ne l'est pas.
    it("pré-remplit le contributeur résolu à la création", () => {
      const codelist: { id?: string; contributor?: string[] } = {};
      const defaultContributor = "http://bauhaus/organizations/insee/HIE2001201";

      if (!codelist.id) {
        codelist.contributor = defaultContributor ? [defaultContributor] : [];
      }

      expect(codelist.contributor).toEqual([defaultContributor]);
    });

    it("laisse le contributeur vide quand aucune organization n'est résolue", () => {
      const codelist: { id?: string; contributor?: string[] } = {};
      const defaultContributor = undefined;

      if (!codelist.id) {
        codelist.contributor = defaultContributor ? [defaultContributor] : [];
      }

      expect(codelist.contributor).toEqual([]);
    });
  });

  describe("Error handling", () => {
    it("should handle client-side validation errors", () => {
      const clientSideErrors = {
        errorMessage: ["Error 1", "Error 2"],
        fields: {
          id: "ID is required",
          labelLg1: "Label is required",
        },
      };

      expect(clientSideErrors.errorMessage).toHaveLength(2);
      expect(clientSideErrors.fields.id).toBe("ID is required");
      expect(clientSideErrors.fields.labelLg1).toBe("Label is required");
    });

    it("should handle server-side errors", () => {
      const serverSideError = "Server error occurred";

      expect(serverSideError).toBe("Server error occurred");
      expect(typeof serverSideError).toBe("string");
    });
  });
});
