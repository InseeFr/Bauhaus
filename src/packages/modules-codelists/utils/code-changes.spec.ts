import { vi } from "vitest";

import { CodelistsApi } from "@sdk/index";

import {
  CodeChanges,
  mergeCodeChanges,
  saveCodeChanges,
  withCreatedCode,
  withDeletedCode,
  withUpdatedCode,
} from "./code-changes";

vi.mock("@sdk/index", () => ({
  CodelistsApi: {
    postCodesDetailedCodelist: vi.fn(() => Promise.resolve()),
    putCodesDetailedCodelist: vi.fn(() => Promise.resolve()),
    deleteCodesDetailedCodelist: vi.fn(() => Promise.resolve()),
  },
}));

const code = (value: string, labelLg1 = `label ${value}`) => ({
  code: value,
  labelLg1,
  labelLg2: labelLg1,
});

describe("pending code changes", () => {
  it("records a created code", () => {
    expect(withCreatedCode({}, code("003"))).toEqual({
      "003": { type: "created", code: code("003") },
    });
  });

  it("keeps a code created then modified as a creation", () => {
    const changes = withUpdatedCode(withCreatedCode({}, code("003")), code("003", "modifié"));

    expect(changes["003"]).toEqual({ type: "created", code: code("003", "modifié") });
  });

  it("records a modified existing code as an update", () => {
    expect(withUpdatedCode({}, code("001", "modifié"))["001"]).toEqual({
      type: "updated",
      code: code("001", "modifié"),
    });
  });

  it("forgets a code created then deleted", () => {
    const changes = withDeletedCode(withCreatedCode({}, code("003")), code("003"));

    expect(changes).toEqual({});
  });

  it("records a deleted existing code, even if it was modified before", () => {
    const changes = withDeletedCode(withUpdatedCode({}, code("001", "modifié")), code("001"));

    expect(changes["001"]).toEqual({ type: "deleted", code: code("001") });
  });

  it("turns a code deleted then created again into an update", () => {
    const changes = withCreatedCode(withDeletedCode({}, code("001")), code("001", "recréé"));

    expect(changes["001"]).toEqual({ type: "updated", code: code("001", "recréé") });
  });
});

describe("mergeCodeChanges", () => {
  const items = [code("001"), code("002")];

  it("hides deleted codes, shows modified values and lists created codes first", () => {
    let changes: CodeChanges = withCreatedCode({}, code("003"));
    changes = withUpdatedCode(changes, code("001", "modifié"));
    changes = withDeletedCode(changes, code("002"));

    expect(mergeCodeChanges(items, changes)).toEqual([code("003"), code("001", "modifié")]);
  });

  it("returns the items unchanged when nothing is pending", () => {
    expect(mergeCodeChanges(items, {})).toEqual(items);
  });
});

describe("saveCodeChanges", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sends deletions, then updates, then creations, and reports each saved code", async () => {
    const calls: string[] = [];
    vi.mocked(CodelistsApi.deleteCodesDetailedCodelist).mockImplementation(async () => {
      calls.push("delete");
    });
    vi.mocked(CodelistsApi.putCodesDetailedCodelist).mockImplementation(async () => {
      calls.push("put");
    });
    vi.mocked(CodelistsApi.postCodesDetailedCodelist).mockImplementation(async () => {
      calls.push("post");
    });
    let changes: CodeChanges = withCreatedCode({}, code("003"));
    changes = withUpdatedCode(changes, code("001", "modifié"));
    changes = withDeletedCode(changes, code("002"));
    const onSaved = vi.fn();

    await saveCodeChanges("cl1", changes, onSaved);

    expect(calls).toEqual(["delete", "put", "post"]);
    expect(CodelistsApi.deleteCodesDetailedCodelist).toHaveBeenCalledWith("cl1", code("002"));
    expect(CodelistsApi.putCodesDetailedCodelist).toHaveBeenCalledWith(
      "cl1",
      code("001", "modifié"),
    );
    expect(CodelistsApi.postCodesDetailedCodelist).toHaveBeenCalledWith("cl1", code("003"));
    expect(onSaved.mock.calls.map(([saved]) => saved)).toEqual(["002", "001", "003"]);
  });

  it("stops at the first failure, keeping the next changes unsent", async () => {
    vi.mocked(CodelistsApi.deleteCodesDetailedCodelist).mockRejectedValue(new Error("boom"));
    let changes: CodeChanges = withCreatedCode({}, code("003"));
    changes = withDeletedCode(changes, code("002"));
    const onSaved = vi.fn();

    await expect(saveCodeChanges("cl1", changes, onSaved)).rejects.toThrow("boom");

    expect(CodelistsApi.postCodesDetailedCodelist).not.toHaveBeenCalled();
    expect(onSaved).not.toHaveBeenCalled();
  });
});
