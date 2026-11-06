import { describe, vi } from "vitest";

import { CompressFormatInput } from "./CompressFormatInput";
import { itBehavesLikeADatalistInput } from "./datalist-input.testing";

vi.mock("react-i18next", async () =>
  (await import("../translations.testing")).translationsModule({
    "distribution.compressFormat": "Compress format",
  }),
);

describe("CompressFormatInput", () => {
  itBehavesLikeADatalistInput({
    Input: CompressFormatInput,
    label: "Compress format",
    id: "compressFormat",
    options: ["7Z", "TAR GZ", "ZIP"],
  });
});
