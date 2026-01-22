import { vi } from "vitest";

import * as useOrganizationsHook from "@utils/hooks/organizations";

import { CL_FREQ } from "../../../constants/code-lists";
import { renderWithRouter } from "../../../tests/render";
import OperationsIndicatorVisualization from "./general";

vi.spyOn(useOrganizationsHook, "useOrganizations").mockReturnValue({
  data: [
    {
      id: "CNAMTS",
      label: "Agence centrale des organismes de sécurité sociale",
    },
    { id: "DG75-F110", label: "Banque Publique d'Investissement" },
  ],
});

const indicator = {
  creator: "CNAMTS",
  prefLabelLg1: "Index Divers (base 2010)",
  prefLabelLg2: "Various indices for construction (Base 2010)",
  replaces: [
    {
      labelLg2: "Various indices for Previous Construction Bases",
      labelLg1: "Index Divers (base antérieure à 2010)",
      id: "p1662",
      type: "indicator",
    },
  ],
  accrualPeriodicityList: CL_FREQ,
  seeAlso: [
    {
      labelLg2: "Building Index base 2010",
      labelLg1: "Index Batiment 2010",
      id: "p1622",
      type: "indicator",
    },
    {
      labelLg2: "Building and public works index (reference 1974 and reference 1975)",
      labelLg1: "Index Bâtiment et Travaux Publics (bases 1974 et 1975)",
      id: "p1623",
      type: "indicator",
    },
    {
      labelLg2: "Public works Indice (base 2010)",
      labelLg1: "Index Travaux Publics (base 2010)",
      id: "p1660",
      type: "indicator",
    },
  ],
  wasGeneratedBy: [
    {
      labelLg2: "Survey on observation of prices in industry and services",
      labelLg1: "Enquête observation des prix de l'industrie et des services",
      id: "s1353",
      type: "series",
    },
  ],
  publishers: [],
  abstractLg1:
    "En application du décret 2014-114 du 7 février 2014 et de la circulaire du 16 mai 2014 (BOAC 60 de septembre-octobre 2014 la maîtrise d'ouvrage des index nationaux Bâtiment (BT), Travaux publics (TP) et divers de la construction est transférée à l’Insee. Les index Bâtiment, Travaux publics et divers de la construction ont été annoncés au Journal Officiel le 20 décembre 2014 et publiés le 16 janvier 2015 en base 2010 depuis janvier 2010 à octobre 2014. \nLe changement de base signifie un changement de référence (moyenne de 2010 = 100), mais aussi une mise à jour des pondérations et des conventions méthodologiques. \nCes index sont utilisés pour les actualisations et révisions des prix des marchés de construction.",
  abstractLg2:
    "In application of Decree 2014-114 of 7 February 2014 and of circular of 16 May 2014 (BOAC 60 September-October 2014) the responsibility of building (BT), public works (TP) and various construction (ID) indices is transferred to INSEE. The building (BT), public works (TP) and various construction (ID) indices were announced in the Official Journal of December 20, 2014 and published on January 16th, 2015 in base 2010 since January 2010 until October 2014.\nThe base change means a change of reference period (average  2010 = 100), but also an update of weights and methodological conventions.\nThese indices are used for escalation and update of construction contracts.",
  historyNoteLg2:
    "BOAC 60 de septembre-octobre 2014\nBefore Decree 2014-114 of 7 February 2014 and circular of 16 May 2014 (BOAC 60 September-October 2014), the Building (BT), Public Works (TP) and various construction indices were compiled and disseminated under the responsibility of Ministry of Ecology, Sustainable Development and Energy, since 1974 for most Building indices, 1975 for most Public Works indices, 1973 or diverse dates after 2000 for various ndices.",
  contributors: [
    {
      id: "CNAMTS",
    },
  ],
  historyNoteLg1:
    "En application du décret 2014-114 du 7 février 2014 et de la circulaire du 16 mai 2014 (BOAC 60 de septembre-octobre 2014  la maîtrise d'ouvrage des index nationaux Bâtiment, Travaux publics et divers de la construction des index est transférée à l'Insee.",
  accrualPeriodicityCode: "M",
  id: "p1649",
  isReplacedBy: [
    {
      labelLg2: "Various indices for Previous Construction Bases",
      labelLg1: "Index Divers (base antérieure à 2010)",
      id: "p1662",
      type: "indicator",
    },
  ],
};
describe("IndicatorInformation", () => {
  it("should renderer all informations for the main lang", () => {
    const { container } = renderWithRouter(<OperationsIndicatorVisualization attr={indicator} />);
    expect(container.querySelectorAll(".bauhaus-display-links")).toHaveLength(4);
    expect(container.querySelectorAll(".bauhaus-see-also")).toHaveLength(1);
  });

  it("should show the right number of DisplayLinks component", () => {
    const { container } = renderWithRouter(
      <OperationsIndicatorVisualization attr={indicator} secondLang={true} />,
    );
    expect(container.querySelectorAll(".bauhaus-display-links")).toHaveLength(4);
  });
  it("should show the right data in the DisplayLinks component", () => {
    const { container } = renderWithRouter(
      <OperationsIndicatorVisualization attr={indicator} secondLang={true} />,
    );
    const displayLinks = container.querySelectorAll(".bauhaus-display-links");

    const contributor = displayLinks[0];
    expect(contributor.querySelector("p").innerHTML).toBe(
      "Agence centrale des organismes de sécurité sociale",
    );

    const replaces = displayLinks[1];
    expect(replaces.querySelector("a").href).toContain("/operations/indicator/p1662");

    const replacedBy = displayLinks[2];
    expect(replacedBy.querySelector("a").href).toContain("/operations/indicator/p1662");

    const wasGeneratedBy = displayLinks[3];
    expect(wasGeneratedBy.querySelector("a").href).toContain("/operations/series/s1353");
  });
  it("should show the right number of SeeAlso component", () => {
    const { container } = renderWithRouter(
      <OperationsIndicatorVisualization attr={indicator} secondLang={true} />,
    );
    const seeAlso = container.querySelector(".bauhaus-see-also");

    const a = seeAlso.querySelectorAll("a");
    expect(a).toHaveLength(6);
  });
});
