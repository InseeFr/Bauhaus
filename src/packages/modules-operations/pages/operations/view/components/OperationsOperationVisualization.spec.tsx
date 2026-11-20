import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import { Operation } from "@model/Operation";

import { OperationsOperationVisualization } from "./OperationsOperationVisualization";

vi.mock("./CreateOperationPhysicalInstance", () => ({
  CreateOperationPhysicalInstance: ({ operationId }: { operationId: string }) => (
    <button>nouveau fichier de {operationId}</button>
  ),
}));

vi.mock("react-i18next", () => {
  const translations: Record<string, string> = {
    "common.operationsTitle": "Operations",
    "common.operationStatus": "Operation status",
    "common.year": "Year",
  };
  const t = (key: string) => translations[key] ?? key;
  return {
    useTranslation: () => ({ t }),
  };
});

const operationWithMainLang = {
  prefLabelLg1: "prefLabelLg1",
  prefLabelLg2: "prefLabelLg2",
  altLabelLg1: "altLabel1",
  year: "2024",
} as unknown as Operation;

const operationWithBothLangs = {
  prefLabelLg1: "prefLabelLg1",
  prefLabelLg2: "prefLabelLg2",
  altLabelLg1: "altLabel1",
  altLabelLg2: "altLabel2",
  year: "2024",
} as unknown as Operation;

const operationWithId = {
  id: "s1234",
  prefLabelLg1: "prefLabelLg1",
  year: "2024",
} as unknown as Operation;

const physicalInstances = [{ id: "pi-1", label: "Individus", agency: "fr.insee" }];

describe("OperationVisualization", () => {
  it("should renderer all informations for the main lang", () => {
    const { container } = render(
      <OperationsOperationVisualization attr={operationWithMainLang} secondLang={false} />,
    );
    expect(container.querySelectorAll(".grid:first-child .note")).toHaveLength(1);
    screen.getByText("Year : 2024");
  });

  it("should renderer all informations for the second lang", () => {
    const { container } = render(
      <OperationsOperationVisualization attr={operationWithBothLangs} secondLang={true} />,
    );

    expect(container.querySelectorAll(".note")).toHaveLength(5);

    screen.getByText("Year : 2024");
  });

  const renderWithPhysicalInstances = (instances: typeof physicalInstances | undefined) =>
    render(
      <MemoryRouter>
        <OperationsOperationVisualization
          attr={operationWithId}
          secondLang={false}
          physicalInstances={instances}
        />
      </MemoryRouter>,
    );

  const dataFilesBanner = () =>
    screen.getByText("operationPhysicalInstance.listTitle").closest(".note") as HTMLElement;

  it("affiche les fichiers de données DDI dans un bandeau dédié", () => {
    renderWithPhysicalInstances(physicalInstances);

    expect(within(dataFilesBanner()).getByRole("link", { name: "Individus" })).toHaveAttribute(
      "href",
      "/ddi/physical-instances/fr.insee/pi-1",
    );
  });

  it("ne mêle plus les fichiers de données au bloc des liens", () => {
    renderWithPhysicalInstances(physicalInstances);

    const linksBlock = screen.getByText("app.linksTitle").closest(".note") as HTMLElement;
    expect(within(linksBlock).queryByRole("link", { name: "Individus" })).toBeNull();
    expect(within(linksBlock).queryByRole("button")).toBeNull();
  });

  it("propose de créer un fichier de données depuis le bandeau", () => {
    renderWithPhysicalInstances(physicalInstances);

    within(dataFilesBanner()).getByRole("button", { name: "nouveau fichier de s1234" });
  });

  it("garde le bandeau, pour la création, quand l'opération n'a encore aucun fichier", () => {
    renderWithPhysicalInstances([]);

    within(dataFilesBanner()).getByText("operationPhysicalInstance.none");
    within(dataFilesBanner()).getByRole("button", { name: "nouveau fichier de s1234" });
  });

  it("n'affiche pas le bandeau quand les fichiers de données n'ont pas été chargés", () => {
    renderWithPhysicalInstances(undefined);

    expect(screen.queryByText("operationPhysicalInstance.listTitle")).toBeNull();
  });
});
