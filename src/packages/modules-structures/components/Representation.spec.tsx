import { screen, render, fireEvent } from "@testing-library/react";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("../i18n", () => ({
  structuresI18n: {
    t: (key: string) => {
      const translations: Record<string, string> = {
        "component.representation.date.title": "Date",
        "component.representation.dateTime.title": "DateTime",
        "component.representation.float.title": "Float",
        "component.representation.int.title": "Integer",
        "component.representation.codelist.title": "Codelist",
        "component.representation.paysOuTerritoire.title": "Country or territory",
        "component.representation.string.title": "String",
      };
      return translations[key] ?? key;
    },
  },
}));

import { Component } from "@model/structures/Component";

import { EMPTY_ARRAY } from "@utils/array-utils";

import { XSD_CODE_LIST, XSD_STRING } from "../constants/xsd";
import { Representation } from "./Representation";

const codelists = [{ id: "id", label: "label", notation: "id" }];

describe("Representation", () => {
  it("should display the label of a XSD_TYPES", async () => {
    const component = {
      range: XSD_STRING,
    } as unknown as Component;
    const handleCodelistDetail = vi.fn();

    render(
      <Representation
        component={component}
        codelists={EMPTY_ARRAY}
        handleCodelistDetail={handleCodelistDetail}
      />,
    );
    await screen.findByText("String");
  });

  it("should display a button with the codelist", async () => {
    const component = {
      range: XSD_CODE_LIST,
      codeList: "id",
    } as unknown as Component;
    const handleCodelistDetail = vi.fn();

    render(
      <Representation
        component={component}
        codelists={codelists}
        handleCodelistDetail={handleCodelistDetail}
      />,
    );
    await screen.findByText("label");
    const button = await screen.findByRole("button");

    fireEvent.click(button);
    expect(handleCodelistDetail).toHaveBeenCalled();
  });
});
