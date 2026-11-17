import { describe, vi } from "vitest";

import { itBehavesLikeADatalistInput } from "./datalist-input.testing";
import { MediaTypeInput } from "./MediaTypeInput";

vi.mock("react-i18next", async () =>
  (await import("../translations.testing")).translationsModule({
    "distribution.mediaType": "Media type",
  }),
);

describe("MediaTypeInput", () => {
  itBehavesLikeADatalistInput({
    Input: MediaTypeInput,
    label: "Media type",
    id: "mediaType",
    options: ["CSV", "PARQUET", "XSLX"],
  });
});
