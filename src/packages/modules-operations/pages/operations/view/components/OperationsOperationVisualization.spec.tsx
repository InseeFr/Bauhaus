import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import { Operation } from "@model/Operation";

import { OperationsOperationVisualization } from "./OperationsOperationVisualization";

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

describe("OperationVisualization", () => {
  it("should renderer all informations for the main lang", () => {
    const attr = {
      prefLabelLg1: "prefLabelLg1",
      prefLabelLg2: "prefLabelLg2",
      altLabelLg1: "altLabel1",
      year: "2024",
    } as unknown as Operation;
    const { container } = render(
      <OperationsOperationVisualization attr={attr} secondLang={false} />,
    );
    expect(container.querySelectorAll(".row:first-child .note")).toHaveLength(1);
    screen.getByText("Year : 2024");
  });

  it("should renderer all informations for the second lang", () => {
    const attr = {
      prefLabelLg1: "prefLabelLg1",
      prefLabelLg2: "prefLabelLg2",
      altLabelLg1: "altLabel1",
      altLabelLg2: "altLabel2",
      year: "2024",
    } as unknown as Operation;
    const { container } = render(
      <OperationsOperationVisualization attr={attr} secondLang={true} />,
    );

    expect(container.querySelectorAll(".note")).toHaveLength(5);

    screen.getByText("Year : 2024");
  });

  it("place les fichiers de données DDI dans le bloc des liens", () => {
    const attr = {
      id: "s1234",
      prefLabelLg1: "prefLabelLg1",
      year: "2024",
    } as unknown as Operation;

    render(
      <MemoryRouter>
        <OperationsOperationVisualization
          attr={attr}
          secondLang={false}
          physicalInstances={[{ id: "pi-1", label: "Individus", agency: "fr.insee" }]}
        />
      </MemoryRouter>,
    );

    const linksBlock = screen.getByText("app.linksTitle").closest(".note") as HTMLElement;
    expect(within(linksBlock).getByRole("link", { name: "Individus" })).toHaveAttribute(
      "href",
      "/ddi/physical-instances/fr.insee/pi-1",
    );
  });
});
