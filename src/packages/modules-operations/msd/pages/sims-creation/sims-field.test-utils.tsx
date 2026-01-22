import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";

import { rangeType } from "../../../utils/msd";

/**
 * Creates a React Query client configured for testing
 */
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

/**
 * Renders a component with React Query provider
 */
export const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient();

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

/**
 * Creates default props for SimsField component
 * You can override any prop by passing an object with the desired values
 *
 * @example
 * const props = createDefaultSimsFieldProps({
 *   msd: { rangeType: GEOGRAPHY },
 *   secondLang: true
 * });
 */
export const createDefaultSimsFieldProps = (overrides: any = {}) => {
  const defaultMsd = {
    masLabelLg1: "Test Field",
    idMas: "test-id",
    rangeType: rangeType.TEXT,
    isPresentational: false,
    sansObject: false,
  };

  return {
    msd: {
      ...defaultMsd,
      ...overrides.msd,
    },
    currentSection: overrides.currentSection || {},
    alone: overrides.alone !== undefined ? overrides.alone : true,
    codesLists: overrides.codesLists || {},
    handleChange: overrides.handleChange || vi.fn(),
    organisationsOptions: overrides.organisationsOptions || [],
    unbounded: overrides.unbounded || false,
    secondLang: overrides.secondLang || false,
    ...overrides,
  };
};

/**
 * Creates a mock codes list for CODE_LIST field testing
 */
export const createMockCodesList = (
  codes: Array<{ code: string; labelLg1: string; labelLg2?: string }>,
) => ({
  codeList: {
    codes: codes.map((c) => ({
      code: c.code,
      labelLg1: c.labelLg1,
      labelLg2: c.labelLg2 || c.labelLg1,
    })),
    codeListLabelLg1: "Test Code List",
  },
});

/**
 * Creates mock organisation options for ORGANIZATION field testing
 */
export const createMockOrganisations = (orgs: Array<{ value: string; label: string }>) => orgs;

// Re-export rangeType constants for convenience
export const { RICH_TEXT, TEXT, DATE, CODE_LIST, ORGANIZATION, GEOGRAPHY } = rangeType;
