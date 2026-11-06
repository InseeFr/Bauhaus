import { i18nStub, mandatoryPropertyError } from "@utils/validation.testing";

import { validate } from "./validation";

vi.mock("../../../i18n", () => ({
  operationsI18n: i18nStub(
    {
      en: {
        "app.duplicatedTitle": "This title already exists",
        "common.title": "Title",
        "app.langTitle": "Language",
        "validation.badUrl": "The link is not valid",
        "validation.requiredUpdatedDate": "The update date is required",
        "validation.wrongFileName":
          "The file name is incorrect. It can comprise alphanumeric (except accented characters), dash and underscore symbols",
      },
    },
    "en",
  ),
}));

const CURRENT_LABEL_LG1 = "currentLabelLg1";
const CURRENT_LABEL_LG2 = "currentLabelLg2";

const NO_LINK_FIELD_ERROR = {
  labelLg1: "",
  labelLg2: "",
  lang: "",
  url: "",
};

const NO_DOCUMENT_FIELD_ERROR = {
  labelLg1: "",
  labelLg2: "",
  lang: "",
  updatedDate: "",
  files: "",
};

const titleRequired = mandatoryPropertyError("Title");
const langRequired = mandatoryPropertyError("Language");
const duplicatedTitle = "This title already exists";
const invalidLink = "The link is not valid";
const updatedDateRequired = "The update date is required";
const wrongFileName =
  "The file name is incorrect. It can comprise alphanumeric (except accented characters), dash and underscore symbols";

const cases: {
  name: string;
  documentOrLink: Parameters<typeof validate>[0];
  type: string;
  documentsAndLinksList?: Parameters<typeof validate>[2];
  expected: ReturnType<typeof validate>;
}[] = [
  {
    name: "should return an error if labelLg1 already exists and labelLg2 is empty",
    documentOrLink: {
      labelLg1: "existingLabel",
      labelLg2: "",
      lang: "l",
      url: "http://u",
    },
    type: "link",
    documentsAndLinksList: [
      {
        labelLg1: "existingLabel",
        labelLg2: "existingLabel",
        lang: "",
      },
    ],
    expected: {
      errorMessage: [duplicatedTitle, titleRequired],
      fields: { ...NO_LINK_FIELD_ERROR, labelLg1: duplicatedTitle, labelLg2: titleRequired },
    },
  },
  {
    name: "should return an error for url",
    documentOrLink: {
      labelLg1: "labelLg1",
      labelLg2: "labelLg2",
      lang: "l",
      url: "mailto:you",
    },
    type: "link",
    expected: {
      errorMessage: [invalidLink],
      fields: { ...NO_LINK_FIELD_ERROR, url: invalidLink },
    },
  },
  {
    name: "should return an error for lang",
    documentOrLink: {
      labelLg1: "labelLg1",
      labelLg2: "labelLg2",
      lang: "",
      updatedDate: "d",
      files: [{ name: "path/correct-file_name.123" }],
    },
    type: "document",
    expected: {
      errorMessage: [langRequired],
      fields: { ...NO_DOCUMENT_FIELD_ERROR, lang: langRequired },
    },
  },
  {
    name: "should return an error for updateDate",
    documentOrLink: {
      labelLg1: "labelLg1",
      labelLg2: "labelLg2",
      lang: "l",
      files: [{ name: "path/correct-file_name.123" }],
    },
    type: "document",
    expected: {
      errorMessage: [updatedDateRequired],
      fields: { ...NO_DOCUMENT_FIELD_ERROR, updatedDate: updatedDateRequired },
    },
  },
  {
    name: "should return an error for file",
    documentOrLink: {
      labelLg1: "labelLg1",
      labelLg2: "labelLg2",
      lang: "l",
      updatedDate: "d",
      files: [{ name: "path/wrong&file@name!.png" }],
    },
    type: "document",
    expected: {
      errorMessage: [wrongFileName],
      fields: { ...NO_DOCUMENT_FIELD_ERROR, files: wrongFileName },
    },
  },
  {
    name: "should return no error",
    documentOrLink: {
      labelLg1: "labelLg2",
      labelLg2: "labelLg2",
      lang: "l",
      url: "https://u",
    },
    type: "link",
    expected: {
      errorMessage: [],
      fields: NO_LINK_FIELD_ERROR,
    },
  },
  {
    name: "should return no error either",
    documentOrLink: {
      labelLg1: "labelLg2",
      labelLg2: "labelLg2",
      lang: "l",
      updatedDate: "d",
      files: [{ name: "correct-file_name.123" }],
    },
    type: "document",
    expected: {
      errorMessage: [],
      fields: NO_DOCUMENT_FIELD_ERROR,
    },
  },
];

describe("validation", function () {
  cases.forEach(({ name, documentOrLink, type, documentsAndLinksList = [], expected }) => {
    it(name, function () {
      expect(
        validate(documentOrLink, type, documentsAndLinksList, CURRENT_LABEL_LG1, CURRENT_LABEL_LG2),
      ).toEqual(expected);
    });
  });
});
