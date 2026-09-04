import "@testing-library/jest-dom";
import { vi, beforeEach } from "vitest";
import { testsI18n } from "./src/packages/tests/i18n";
import { appI18n } from "./src/packages/i18n";
import { componentsI18n } from "./src/packages/components/i18n";
import { classificationsI18n } from "./src/packages/modules-classifications/i18n";
import { codelistsI18n } from "./src/packages/modules-codelists/i18n";
import { conceptsI18n } from "./src/packages/modules-concepts/i18n";
import { datasetsI18n } from "./src/packages/modules-datasets/i18n";
import { ddiI18n } from "./src/packages/modules-ddi/i18n";
import { operationsI18n } from "./src/packages/modules-operations/i18n";
import { structuresI18n } from "./src/packages/modules-structures/i18n";

// Each module owns an isolated i18n instance (see modules-*/i18n/index.ts), so
// forcing the test language means forcing it on every one of them individually,
// plus the merged tests-only instance used by renderWithRouter/renderWithAppContext.
const allTestI18nInstances = [
  testsI18n,
  appI18n,
  componentsI18n,
  classificationsI18n,
  codelistsI18n,
  conceptsI18n,
  datasetsI18n,
  ddiI18n,
  operationsI18n,
  structuresI18n,
];

beforeEach(() => {
  allTestI18nInstances.forEach((instance) => instance.changeLanguage("en"));
});

// Clear all mocks before each test globally
beforeEach(() => {
  vi.clearAllMocks();
});

// Mock global pour useV2StampsMap
vi.mock("./src/packages/utils/hooks/stamps", async () => {
  const actual = await vi.importActual("./src/packages/utils/hooks/stamps");
  return {
    ...actual,
    useV2StampsMap: vi.fn(
      () =>
        new Map([
          ["DG75-L201", "INSEE"],
          ["DG75-L202", "DARES"],
          ["DG75-G001", "Direction Générale"],
        ]),
    ),
    useV2StampsOptions: vi.fn(() => [
      { value: "DG75-L201", label: "INSEE" },
      { value: "DG75-L202", label: "DARES" },
      { value: "DG75-G001", label: "Direction Générale" },
    ]),
  };
});
