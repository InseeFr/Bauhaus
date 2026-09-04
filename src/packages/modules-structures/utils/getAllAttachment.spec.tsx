import { Component } from "@model/structures/Component";

import { getAllAttachment } from "./getAllAttachment";

describe("getAllAttachment", () => {
  it("should return all default attachments", () => {
    const attachments = getAllAttachment([]);
    expect(attachments).toEqual([
      {
        label: "Observation",
        value: "http://purl.org/linked-data/cube#Observation",
      },
      {
        label: "DataSet",
        value: "http://purl.org/linked-data/cube#DataSet",
      },
      {
        label: "Slice",
        value: "http://purl.org/linked-data/cube#Slice",
      },
    ]);
  });

  it("should return all default attachments with all measures", () => {
    const attachments = getAllAttachment([
      {
        id: "1",
        labelLg1: "labelLg1",
      } as unknown as Component,
    ]);
    expect(attachments).toEqual([
      {
        label: "Observation",
        value: "http://purl.org/linked-data/cube#Observation",
      },
      {
        label: "DataSet",
        value: "http://purl.org/linked-data/cube#DataSet",
      },
      {
        label: "Slice",
        value: "http://purl.org/linked-data/cube#Slice",
      },
      {
        label: "labelLg1",
        value: "1",
      },
    ]);
  });
});
