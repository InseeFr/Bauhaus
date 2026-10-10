import { render, renderHook, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import { DDIApi } from "@sdk/ddi-api";

import type { AppName } from "../../../../../application/app-context";
import { createQueryWrapper } from "../../../../hooks/queryClientWrapper.testing";
import {
  OperationPhysicalInstancesLinks,
  useOperationPhysicalInstances,
} from "./OperationPhysicalInstances";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string, { lng }: { lng: string }) => `${key}(${lng})` }),
}));

vi.mock("@sdk/ddi-api", () => ({
  DDIApi: { getOperationPhysicalInstances: vi.fn() },
}));

let mockVisibleModules: AppName[] = [];
vi.mock("../../../../../application/visible-modules", () => ({
  useVisibleModules: () => mockVisibleModules,
}));

const physicalInstances = [{ id: "pi-1", label: "Individus", agency: "fr.insee" }];
const NO_PHYSICAL_INSTANCES: typeof physicalInstances = [];

describe("useOperationPhysicalInstances", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockVisibleModules = ["operations", "ddi"];
  });

  it("charge les fichiers de données de l'opération, triés par libellé", async () => {
    vi.mocked(DDIApi.getOperationPhysicalInstances).mockResolvedValue([
      { id: "pi-2", label: "Ménages", agency: "fr.insee", versionDate: null },
      { id: "pi-1", label: "Individus", agency: "fr.insee", versionDate: null },
    ]);

    const { result } = renderHook(
      () => useOperationPhysicalInstances("s1234"),
      createQueryWrapper(),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.map((pi) => pi.id)).toEqual(["pi-1", "pi-2"]);
    expect(DDIApi.getOperationPhysicalInstances).toHaveBeenCalledWith("s1234");
  });

  it("n'interroge pas le module DDI quand il n'est pas proposé à l'utilisateur", () => {
    mockVisibleModules = ["operations"];

    const { result } = renderHook(
      () => useOperationPhysicalInstances("s1234"),
      createQueryWrapper(),
    );

    expect(result.current.isLoading).toBe(false);
    expect(DDIApi.getOperationPhysicalInstances).not.toHaveBeenCalled();
  });
});

describe("OperationPhysicalInstancesLinks", () => {
  it("liste les fichiers de données sous leur intitulé, avec un lien vers le module DDI", () => {
    render(
      <MemoryRouter>
        <OperationPhysicalInstancesLinks lng="en" physicalInstances={physicalInstances} />
      </MemoryRouter>,
    );

    screen.getByText("common.physicalInstances(en)");
    expect(screen.getByRole("link", { name: "Individus" })).toHaveAttribute(
      "href",
      "/ddi/physical-instances/fr.insee/pi-1",
    );
  });

  it("n'affiche rien sans fichier de données", () => {
    const { container } = render(
      <OperationPhysicalInstancesLinks lng="fr" physicalInstances={NO_PHYSICAL_INSTANCES} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
