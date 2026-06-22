import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "structure.notation": "Notation",
        "structure.validationStatus": "Publication status",
        "structure.creator": "Owner",
        "structure.contributors": "Contributors",
        "structure.globalInformation": "Global information",
      };
      return translations[key] ?? key;
    },
  }),
}));

import { Structure } from "../../../../../model/structures/Structure";
import { GlobalInformationsPanel } from "./GlobalInformationsPanel";

vi.mock("@utils/hooks/organizations", () => ({
  useOrganizations: () => ({
    data: [
      { iri: "STAMP CREATOR", label: "STAMP CREATOR" },
      { iri: "STAMP CONTRIBUTOR", label: "STAMP CONTRIBUTOR" },
    ],
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("GlobalInformationsPanel", () => {
  const mockStructure: Structure = {
    identifiant: "12345",
    created: "2022-01-01",
    modified: "2022-02-01",
    creator: "STAMP CREATOR",
    contributor: ["STAMP CONTRIBUTOR"],
    disseminationStatus: "http:/id.insee.fr/codes/base/statutDiffusion/PublicGenerique",
  } as Structure;

  it("should render the structure information correctly", () => {
    render(<GlobalInformationsPanel structure={mockStructure} />, {
      wrapper: createWrapper(),
    });

    screen.getByText(/12345/);
    screen.getByText(/Creation date : 01\/01\/2022/);
    screen.getByText(/Modification date : 02\/01\/2022/);
    screen.getByText(/Publication status : Provisional/);
    screen.getByText(/Owner : STAMP CREATOR/);
    screen.getByText(/Contributors :/);
    screen.getByText(/STAMP CONTRIBUTOR/);
    screen.getByText(/Dissemination status : Public generic/);
  });
});
