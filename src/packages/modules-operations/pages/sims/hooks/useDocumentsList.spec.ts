import { GeneralApi } from "@sdk/general-api";

import { getDocumentsList } from "./useDocumentsList";

describe("getDocumentsList", () => {
  it("sorts lg1 by labelLg1 and lg2 by labelLg2 independently", async () => {
    using _api = vi.spyOn(GeneralApi, "getDocumentsList").mockResolvedValue([
      { uri: "http://doc/1", labelLg1: "B", labelLg2: "A" },
      { uri: "http://doc/2", labelLg1: "A", labelLg2: "B" },
    ] as any);

    const { lg1, lg2 } = await getDocumentsList();

    expect(lg1.map((d) => d.labelLg1)).toEqual(["A", "B"]);
    expect(lg2.map((d) => d.labelLg2)).toEqual(["A", "B"]);
  });
});
