import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { SimsField } from "./SimsField";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const selectSpy = vi.fn();

vi.mock("@components/select-rmes", () => ({
  Select: (props: any) => {
    selectSpy(props);
    return <div data-testid="select-stub" />;
  },
}));

const buildMsd = () => ({
  masLabelLg1: "Statut",
  masLabelLg2: "Status",
  idMas: "I.6.3",
  rangeType: "CODE_LIST",
  codeList: "CL_SURVEY_STATUS",
  isPresentational: false,
  sansObject: false,
});

const stableSection = {
  rangeType: "CODE_LIST",
  idAttribute: "I.6.3",
  value: "",
  labelLg1: "",
  labelLg2: "",
};

const lastOptions = () => selectSpy.mock.calls.at(-1)?.[0].options;

describe("SimsField - memo and codesLists", () => {
  it("re-renders the code list options when codesLists arrives after the first render", () => {
    selectSpy.mockClear();
    const msd = buildMsd();
    const handleChange = vi.fn();

    const { rerender } = render(
      <SimsField
        msd={msd}
        currentSection={stableSection}
        codesLists={{}}
        handleChange={handleChange}
        alone={true}
        secondLang={false}
        unbounded={false}
        organisationsOptions={[]}
      />,
      { wrapper: createWrapper() },
    );

    expect(lastOptions()).toEqual([]);

    rerender(
      <SimsField
        msd={msd}
        currentSection={stableSection}
        codesLists={{
          CL_SURVEY_STATUS: {
            notation: "CL_SURVEY_STATUS",
            codes: [
              { code: "T", labelLg1: "Total", labelLg2: "Total" },
              { code: "C", labelLg1: "Compulsory", labelLg2: "Compulsory" },
            ],
          },
        }}
        handleChange={handleChange}
        alone={true}
        secondLang={false}
        unbounded={false}
        organisationsOptions={[]}
      />,
    );

    expect(lastOptions()).toEqual([
      { value: "C", label: "Compulsory" },
      { value: "T", label: "Total" },
    ]);
  });
});
