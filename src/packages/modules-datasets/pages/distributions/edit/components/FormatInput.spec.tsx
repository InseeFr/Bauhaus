import { describe, vi } from "vitest";

import { itBehavesLikeADatalistInput } from "./datalist-input.testing";
import { FormatInput } from "./FormatInput";

vi.mock("react-i18next", async () =>
  (await import("../translations.testing")).translationsModule({
    "distribution.format": "Format",
  }),
);

describe("FormatInput", () => {
  itBehavesLikeADatalistInput({
    Input: FormatInput,
    label: "Format",
    id: "format",
    options: ["CSV", "PARQUET"],
  });
});
