import { vi } from "vitest";

import { describeCodePreview } from "./codePreview.testing";
import { DdiXmlPreview } from "./DdiXmlPreview";

vi.mock("react-i18next", () => import("./codePreview.testing"));

vi.mock("./useHighlight", async () =>
  (await import("./codePreview.testing")).highlightModule("hljs-tag"),
);

vi.mock("./DdiPreview.css", () => ({}));

describeCodePreview("DdiXmlPreview", {
  Preview: DdiXmlPreview,
  code: "<root/>",
  language: "xml",
  highlightClass: "hljs-tag",
});
