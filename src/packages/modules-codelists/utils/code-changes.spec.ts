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

describe("links between codes", () => {
  const linked = (value: string, broader: string[] = [], narrower: string[] = []) => ({
    ...code(value),
    broader,
    narrower,
  });

  it("adds the child to a pending parent when a code chooses it as parent", () => {
    const changes = withUpdatedCode(
      withUpdatedCode({}, linked("A", [], [])),
      linked("A1", ["A"], []),
    );

    expect(changes["A"].code.narrower).toEqual(["A1"]);
  });

  it("adds the parent to a pending child when a code chooses it as child", () => {
    const changes = withCreatedCode(withUpdatedCode({}, linked("A1")), linked("A", [], ["A1"]));

    expect(changes["A1"].code.broader).toEqual(["A"]);
  });

  it("removes the child from a pending parent when a code drops that parent", () => {
    const changes = withUpdatedCode(
      withUpdatedCode({}, linked("A", [], ["A1", "A2"])),
      linked("A1", [], []),
    );

    expect(changes["A"].code.narrower).toEqual(["A2"]);
  });

  it("removes a deleted code from the links of pending codes", () => {
    const changes = withDeletedCode(withUpdatedCode({}, linked("A", [], ["A1"])), linked("A1"));

    expect(changes["A"].code.narrower).toEqual([]);
  });

  it("shows on displayed codes the links chosen from pending codes", () => {
    const items = [linked("A"), linked("B", [], ["A2"]), linked("A2", ["B"])];
    let changes = withUpdatedCode({}, linked("A1", ["A"], []));
    changes = withDeletedCode(changes, linked("A2"));

    const merged = mergeCodeChanges(items, changes);

    expect(merged.find((c) => c.code === "A")?.narrower).toEqual(["A1"]);
    expect(merged.find((c) => c.code === "B")?.narrower).toEqual([]);
  });
});

describe("saveCodeChanges", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sends deletions, then creations, then updates, and reports each saved code", async () => {
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

    expect(calls).toEqual(["delete", "post", "put"]);
    expect(CodelistsApi.deleteCodesDetailedCodelist).toHaveBeenCalledWith("cl1", code("002"));
    expect(CodelistsApi.putCodesDetailedCodelist).toHaveBeenCalledWith(
      "cl1",
      code("001", "modifié"),
    );
    expect(CodelistsApi.postCodesDetailedCodelist).toHaveBeenCalledWith("cl1", code("003"));
    expect(onSaved.mock.calls.map(([saved]) => saved)).toEqual(["002", "003", "001"]);
  });

  it("creates a code with its links toward codes that are not created afterwards", async () => {
    const withLinks = (value: string, broader: string[], narrower: string[] = []) => ({
      ...code(value),
      broader,
      narrower,
    });
    let changes: CodeChanges = withCreatedCode({}, withLinks("A", ["ROOT"]));
    changes = withCreatedCode(changes, withLinks("A1", ["A"]));

    await saveCodeChanges("cl1", changes, vi.fn());

    // Le lien A-A1 est posé par la création de A1, une fois A enregistré : le back l'écrit dans les deux sens.
    expect(CodelistsApi.postCodesDetailedCodelist).toHaveBeenNthCalledWith(
      1,
      "cl1",
      withLinks("A", ["ROOT"], []),
    );
    expect(CodelistsApi.postCodesDetailedCodelist).toHaveBeenNthCalledWith(
      2,
      "cl1",
      withLinks("A1", ["A"]),
    );
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
