import { vi } from "vitest";

import { describeCodePreview } from "./codePreview.testing";
import { DdiJsonPreview } from "./DdiJsonPreview";

vi.mock("react-i18next", () => import("./codePreview.testing"));

vi.mock("./useHighlight", async () =>
  (await import("./codePreview.testing")).highlightModule("hljs-attr"),
);

vi.mock("./DdiPreview.css", () => ({}));

describeCodePreview("DdiJsonPreview", {
  Preview: DdiJsonPreview,
  code: '{"key":"value"}',
  language: "json",
  highlightClass: "hljs-attr",
});
