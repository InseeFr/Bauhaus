import { pickGeographiesByUri } from "./hooks";

describe("pickGeographiesByUri", () => {
  const allGeographies = [
    { value: "uri-1", label: "France" },
    { value: "uri-2", label: "Germany" },
    { value: "uri-3", label: "Spain" },
  ] as any;

  it("returns matching geographies preserving the input order of refs", () => {
    const refs = [{ uri: "uri-3" }, { uri: "uri-1" }];

    expect(pickGeographiesByUri(refs, allGeographies)).toEqual([
      { value: "uri-3", label: "Spain" },
      { value: "uri-1", label: "France" },
    ]);
  });

  it("returns undefined slots for unknown uris", () => {
    const refs = [{ uri: "uri-1" }, { uri: "missing" }];

    expect(pickGeographiesByUri(refs, allGeographies)).toEqual([
      { value: "uri-1", label: "France" },
      undefined,
    ]);
  });

  it("returns an empty array when there are no refs", () => {
    expect(pickGeographiesByUri([], allGeographies)).toEqual([]);
  });

  it("returns the same length as refs even when allGeographies is empty", () => {
    expect(pickGeographiesByUri([{ uri: "uri-1" }, { uri: "uri-2" }], [])).toEqual([
      undefined,
      undefined,
    ]);
  });
});
