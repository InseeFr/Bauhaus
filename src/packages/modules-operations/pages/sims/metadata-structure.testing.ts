import { vi } from "vitest";

import { useMetadataStructure } from "../../hooks/useMetadataStructure";

/**
 * Pilote le hook `useMetadataStructure`, que le spec doit automocker :
 * `vi.mock("../../../hooks/useMetadataStructure")`.
 */
export const mockMetadataStructure = ({ loaded }: { loaded: boolean }) =>
  vi
    .mocked(useMetadataStructure)
    .mockReturnValue(
      (loaded
        ? { isLoading: false, metadataStructure: {} }
        : { isLoading: true, metadataStructure: undefined }) as any,
    );
