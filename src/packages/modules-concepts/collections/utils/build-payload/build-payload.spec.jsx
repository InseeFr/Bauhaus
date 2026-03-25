import buildPayload from "./build-payload";

const collection = {
  general: {
    id: "id",
    prefLabelLg1: "prefLabelLg1",
    prefLabelLg2: "prefLabelLg2",
    creator: "creator",
    contributor: "contributor",
    descriptionLg1: "descriptionLg1",
    descriptionLg2: "descriptionLg2",
    created: "created",
  },
  members: [
    { id: "1", label: "label1" },
    { id: "2", label: "label2" },
  ],
};

const expectedLabels = [
  { lang: "fr", value: "prefLabelLg1" },
  { lang: "en", value: "prefLabelLg2" },
];

const expectedDescriptions = [
  { lang: "fr", value: "descriptionLg1" },
  { lang: "en", value: "descriptionLg2" },
];

describe("build-payload", () => {
  it("CREATE", () => {
    const output = buildPayload(collection, "CREATE");
    expect(output).toEqual({
      id: "id",
      creator: "creator",
      contributor: "contributor",
      labels: expectedLabels,
      descriptions: expectedDescriptions,
      conceptsIdentifiers: ["1", "2"],
    });
  });

  it("UPDATE", () => {
    const output = buildPayload(collection, "UPDATE");
    expect(output).toEqual({
      id: "id",
      created: "created",
      creator: "creator",
      contributor: "contributor",
      labels: expectedLabels,
      descriptions: expectedDescriptions,
      conceptsIdentifiers: ["1", "2"],
    });
  });
});
