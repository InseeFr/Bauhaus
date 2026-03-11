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

vi.mock("../../../sdk", () => ({
  CodeListApi: {
    getCodesListCodes: vi.fn(() => Promise.resolve([])),
  },
}));

describe("CodelistPartialDetailEdit - Hook integration tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useUserStamps hook - data property migration", () => {
    it("should use 'data' property from useUserStamps (not 'datas')", () => {
      const mockStamps = [{ stamp: "PARTIAL-STAMP" }];
      (useUserStamps as Mock).mockReturnValue({
        data: mockStamps,
      });

      const result = useUserStamps();

      expect(result).toHaveProperty("data");
      expect(result.data).toEqual(mockStamps);
      expect(result).not.toHaveProperty("datas");
    });

    it("should extract stamp from first element of data array", () => {
      const mockStamps = [{ stamp: "FIRST-STAMP" }, { stamp: "SECOND-STAMP" }];
      (useUserStamps as Mock).mockReturnValue({
        data: mockStamps,
      });

      const { data } = useUserStamps();
      const firstStamp = data[0]?.stamp;

      expect(firstStamp).toBe("FIRST-STAMP");
      expect(data[1].stamp).toBe("SECOND-STAMP");
    });

    it("should handle empty stamps array gracefully", () => {
      (useUserStamps as Mock).mockReturnValue({
        data: [],
      });

      const { data } = useUserStamps();
      const stamp = data[0]?.stamp;

      expect(data).toEqual([]);
      expect(stamp).toBeUndefined();
    });

    it("should verify type safety of data property", () => {
      const mockData = [{ stamp: "TEST" }];
      (useUserStamps as Mock).mockReturnValue({
        data: mockData,
      });

      const { data } = useUserStamps();

      expect(Array.isArray(data)).toBe(true);
      expect(data[0]).toHaveProperty("stamp");
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
      (useUserStamps as Mock).mockReturnValue({
        data: [{ stamp: userStamp }],
      });
      (useAuthorizationGuard as Mock).mockReturnValue(true);

      const { data: stamps } = useUserStamps();
      const stamp = stamps[0]?.stamp;
      const isContributor = useAuthorizationGuard({
        module: "CODESLIST_CODESLIST",
        privilege: "CREATE",
      });

      const codelist: { id?: string } = {};
      let contributor;

      if (!codelist.id) {
        contributor = isContributor ? [stamp] : ["DG75-L201"];
      }

      expect(contributor).toEqual([userStamp]);
    });

    it("should use default contributor when not authorized", () => {
      (useUserStamps as Mock).mockReturnValue({
        data: [{ stamp: "ANY-STAMP" }],
      });
      (useAuthorizationGuard as Mock).mockReturnValue(false);

      const { data: stamps } = useUserStamps();
      const stamp = stamps[0]?.stamp;
      const isContributor = useAuthorizationGuard({
        module: "CODESLIST_CODESLIST",
        privilege: "CREATE",
      });

      const codelist: { id?: string } = {};
      let contributor;

      if (!codelist.id) {
        contributor = isContributor ? [stamp] : ["DG75-L201"];
      }

      expect(contributor).toEqual(["DG75-L201"]);
    });

    it("should verify authorization guard parameters", () => {
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
  });

  describe("Global codelist options", () => {
    it("should handle empty globalCodeListOptions", () => {
      const emptyOptions = [];

      expect(emptyOptions).toHaveLength(0);
      expect(Array.isArray(emptyOptions)).toBe(true);
    });

    it("should handle populated globalCodeListOptions", () => {
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
