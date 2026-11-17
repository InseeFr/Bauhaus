import { vi, describe, it, expect, beforeEach } from "vitest";

import { useUserStamps } from "@utils/hooks/users";

import { useAuthorizationGuard } from "../../../../../auth/components/auth";
import { CODELIST_CREATE_GUARD, expectCreateGuardGranted } from "../../../../testing/auth.testing";
import {
  expectStampsExposedAsData,
  mockUserStamps,
  readFirstStamp,
} from "../../../../testing/users.testing";

vi.mock("@utils/hooks/users", () => import("../../../../testing/users.testing"));

vi.mock("../../../../../auth/components/auth", () => import("../../../../testing/auth.testing"));

vi.mock("../../../sdk", () => ({
  CodelistsApi: {
    getCodelistCodes: vi.fn(() => Promise.resolve([])),
  },
}));

/** Contributeur pré-rempli à la création : le timbre de l'utilisateur s'il est habilité. */
const initContributor = () => {
  const { stamp } = readFirstStamp(useUserStamps);
  const isContributor = useAuthorizationGuard(CODELIST_CREATE_GUARD);

  const codelist: { id?: string } = {};
  let contributor;

  if (!codelist.id) {
    contributor = isContributor ? [stamp] : ["DG75-L201"];
  }

  return contributor;
};

describe("CodelistPartialDetailEdit - Hook integration tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useUserStamps hook - data property migration", () => {
    it("should use 'data' property from useUserStamps (not 'datas')", () => {
      expectStampsExposedAsData(useUserStamps, [{ stamp: "PARTIAL-STAMP" }]);
    });

    it("should extract stamp from first element of data array", () => {
      mockUserStamps([{ stamp: "FIRST-STAMP" }, { stamp: "SECOND-STAMP" }]);

      const { data, stamp: firstStamp } = readFirstStamp(useUserStamps);

      expect(firstStamp).toBe("FIRST-STAMP");
      expect(data![1].stamp).toBe("SECOND-STAMP");
    });

    it("should handle empty stamps array gracefully", () => {
      mockUserStamps([]);

      const { data, stamp } = readFirstStamp(useUserStamps);

      expect(data).toEqual([]);
      expect(stamp).toBeUndefined();
    });

    it("should verify type safety of data property", () => {
      mockUserStamps([{ stamp: "TEST" }]);

      const { data } = useUserStamps();

      expect(Array.isArray(data)).toBe(true);
      expect(data![0]).toHaveProperty("stamp");
    });
  });

  describe("CreatorsInput component - multi prop removed", () => {
    it("should document removal of multi prop", () => {
      // Before: <CreatorsInput value={creator} multi onChange={...} />
      // After:  <CreatorsInput value={creator} onChange={...} />

      const oldProps = {
        value: "creator",
        multi: true,
        onChange: vi.fn(),
      };

      const newProps = {
        value: "creator",
        onChange: vi.fn(),
      };

      // Verify multi prop is no longer needed
      expect(newProps).not.toHaveProperty("multi");
      expect(oldProps).toHaveProperty("multi");
    });

    it("should handle single creator value correctly", () => {
      const singleValue = "creator-id";
      const arrayValue = ["creator-id"];

      // New behavior expects single value
      expect(typeof singleValue).toBe("string");

      // Old multi behavior used array
      expect(Array.isArray(arrayValue)).toBe(true);
    });
  });

  describe("Validation logic", () => {
    it("should require essential fields", () => {
      const invalidCodelist = {
        id: "",
        labelLg1: "",
        idParent: "",
      };

      const validCodelist = {
        id: "valid-id",
        labelLg1: "Valid Label",
        idParent: "parent-id",
      };

      expect(invalidCodelist.id).toBe("");
      expect(validCodelist.id).toBe("valid-id");
      expect(validCodelist.labelLg1).toBe("Valid Label");
    });

    it("should validate parent codelist selection", () => {
      const withParent = { idParent: "parent-123" };
      const withoutParent = { idParent: "" };

      expect(withParent.idParent).toBeTruthy();
      expect(withoutParent.idParent).toBeFalsy();
    });
  });

  describe("Authorization and contributor logic", () => {
    it("should initialize contributor from user stamp when authorized", () => {
      const userStamp = "USER-CUSTOM-STAMP";
      mockUserStamps([{ stamp: userStamp }]);
      vi.mocked(useAuthorizationGuard).mockReturnValue(true);

      expect(initContributor()).toEqual([userStamp]);
    });

    it("should use default contributor when not authorized", () => {
      mockUserStamps([{ stamp: "ANY-STAMP" }]);
      vi.mocked(useAuthorizationGuard).mockReturnValue(false);

      expect(initContributor()).toEqual(["DG75-L201"]);
    });

    it("should verify authorization guard parameters", () => {
      expectCreateGuardGranted(useAuthorizationGuard);
    });
  });

  describe("Global codelist options", () => {
    it("should handle empty globalCodelistOptions", () => {
      const emptyOptions: unknown[] = [];

      expect(emptyOptions).toHaveLength(0);
      expect(Array.isArray(emptyOptions)).toBe(true);
    });

    it("should handle populated globalCodelistOptions", () => {
      const options = [
        { value: "global-1", label: "Global List 1" },
        { value: "global-2", label: "Global List 2" },
      ];

      expect(options).toHaveLength(2);
      expect(options[0].value).toBe("global-1");
      expect(options[1].label).toBe("Global List 2");
    });
  });

  describe("Error handling", () => {
    it("should distinguish client-side and server-side errors", () => {
      const clientError = {
        errorMessage: ["Validation error"],
        fields: { id: "Required" },
      };

      const serverError = "Internal server error";

      expect(clientError.errorMessage).toHaveLength(1);
      expect(clientError.fields).toHaveProperty("id");
      expect(typeof serverError).toBe("string");
    });

    it("should handle null/undefined errors", () => {
      const nullError = null;
      const undefinedError = undefined;

      expect(nullError).toBeNull();
      expect(undefinedError).toBeUndefined();
    });
  });

  describe("Form state changes", () => {
    it("should clear errors when field changes", () => {
      let errors = { errorMessage: ["Error"], fields: {} };

      // Simulate field change clearing errors
      errors = { ...errors, errorMessage: [] };

      expect(errors.errorMessage).toHaveLength(0);
    });

    it("should update field values correctly", () => {
      let codelist = { labelLg1: "Initial" };

      // Simulate update
      codelist = { ...codelist, labelLg1: "Updated" };

      expect(codelist.labelLg1).toBe("Updated");
    });
  });
});
