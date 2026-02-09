import { vi } from "vitest";

import * as useOrganizationsHook from "@utils/hooks/organizations";

import { CL_FREQ, CL_SOURCE_CATEGORY } from "../../../constants/code-lists";
import { renderWithRouter } from "../../../tests/render";
import OperationsSerieVisualization from "./home";

const organisations = [
  {
    id: "GF3C",
    label: "GF3C",
  },
  {
    id: "DG75-G001",
  },
];

vi.spyOn(useOrganizationsHook, "useOrganizations").mockReturnValue({
  data: organisations,
});

const attr = {
  publishers: [{ id: "GF3C" }],
  creators: ["DG75-G001"],
  prefLabelLg1: "Comptes nationaux trimestriels",
  prefLabelLg2: "Quarterly national accounts",
  replaces: [
    {
      labelLg2: "Unified corporate statistics system",
      labelLg1: "Système unifié de statistiques d'entreprises",
      id: "s1272",
      type: "series",
    },
  ],
  generate: [
    {
      labelLg2: "Local knowledge of the productive system",
      labelLg1: "Connaissance locale de l'appareil productif",
      id: "s1162",
      type: "indicator",
    },
  ],
  dataCollectors: [
    {
      id: "CNAMTS",
    },
    {
      id: "DG75-F110",
    },
  ],
  accrualPeriodicityList: CL_FREQ,
  seeAlso: [
    {
      labelLg2: "Local knowledge of the productive system",
      labelLg1: "Connaissance locale de l'appareil productif",
      id: "s1162",
      type: "series",
    },
  ],
  typeCode: "C",
  abstractLg1:
    "1- Objet des comptes trimestriels\n\n- Trimestrialiser les comptes annuels passés :\n\nLe premier objectif de l'élaboration des comptes trimestriels, en France, consiste à utiliser certaines séries économiques mensuelles ou trimestrielles pour trimestrialiser les comptes annuels du passé. Il s'agit de construire des séries trimestrielles s'intégrant dans le cadre de la comptabilité nationale. Ces séries permettent alors d'affiner le diagnostic sur les enchaînements économiques et de comprendre les délais trimestriels entre les événements.\n\n- Fournir rapidement une description macroéconomique du présent :\n\nLa trimestrialisation des comptes annuels suppose que ces derniers soient connus. Or les estimations des comptes annuels sont relativement tardives : elles fournissent une première idée de la situation macroéconomique d'une année donnée avec le compte provisoire, publié environ quatre mois après la fin de l'année considérée.\n\nEntre-temps, de très nombreux indicateurs conjoncturels sont disponibles et commencent à donner une idée des évolutions macroéconomiques de la période récente. La plupart de ces indicateurs sont également les sources de données infra annuelles qui permettent de construire les comptes trimestriels.\n\nPar exemple, l'indice de la production industrielle constitue la source d'information principale pour connaître les évolutions mensuelles de la production dans l'industrie. La trimestrialisation de la production annuelle passée s'appuie donc beaucoup sur cet indicateur.\n\nFinalement, ces deux caractéristiques des indicateurs conjoncturels, disponibilité rapide et sources d'information sur les dynamiques infra annuelles, ont permis de donner aux comptes trimestriels un objectif supplémentaire : celui de fournir rapidement une description macroéconomique du présent (ou plus exactement du passé récent).\n\nLa méthode utilisée pour trimestrialiser les comptes passés est alors étendue pour permettre d'intégrer immédiatement l'information conjoncturelle disponible, et d'anticiper au mieux les comptes annuels à venir.\n\n2- Utilisation\n\n- L'analyse macroéconomique :\n\nLes comptes trimestriels sont devenus très utiles pour les économistes. La plupart des modèles macro-économétriques français sont ainsi estimés à partir des comptes trimestriels. De même, l'analyse plus spécifique des dynamiques économiques, par exemple la dynamique entre les prix et les salaires ou entre les revenus des ménages et la consommation, est souvent effectuée sur les données des comptes trimestriels.\n\nLes utilisateurs ne doivent toutefois pas oublier que la trimestrialisation des comptes annuels est elle-même une construction qui fait intervenir de multiples sources de données, ainsi que de nombreux outils statistiques tels que l'étalonnage-calage et la correction de l'effet des jours ouvrables et des variations saisonnières. Ces outils ne sont pas toujours neutres sur les résultats économétriques qui peuvent être obtenus avec ces séries.\n\n- L'analyse conjoncturelle :\n\nDans le cadre de l'analyse conjoncturelle, les comptes trimestriels ont rapidement occupé une place centrale. Les indicateurs conjoncturels sont en effet multiples et parfois difficiles à interpréter. Certains portent sur le même objet, mais peuvent différer pour des raisons de champ, de type de collecte de l'information.\n\nDans le domaine de la production industrielle par exemple, les premières informations sont qualitatives et proviennent des enquêtes de conjoncture auprès des entreprises. L'indice de production industrielle est publié un peu plus tardivement et donne une information quantitative. Puis sont publiés les indices de chiffre d'affaires, qui proposent également une évaluation quantitative de l'activité industrielle mensuelle.\n\nLorsque les indicateurs ne portent pas sur le même objet, les différentes informations peuvent parfois être difficiles à réconcilier pour comprendre les tendances conjoncturelles. Ainsi, certains mois, la consommation de produits manufacturés augmente fortement tandis que l'indice de production industrielle indique une stabilité, et que par ailleurs les statistiques des douanes concluent à une baisse des exportations.\n\nIl s'avère finalement assez délicat de synthétiser toutes ces informations. Les comptes trimestriels permettent d'unifier ces informations dans le cadre de la comptabilité nationale, et de les synthétiser sous la forme d'agrégats, tels que le produit intérieur brut (PIB), l'excédent brut d'exploitation des entreprises, le revenu disponible brut des ménages.\n\n- Les prévisions :\n\nLes comptes nationaux trimestriels servent souvent de point de départ à des travaux de prévision. D'une part, l'objet des prévisions de court terme est justement d'anticiper la ou les prochaines publications des comptes trimestriels. La note de conjoncture de l'Insee s'appuie ainsi sur un cadre simplifié des comptes pour un chiffrage prévisionnel sur deux ou trois trimestres. D'autre part, les prévisions de plus long terme sont effectuées à partir de modèles macro-économétriques, dont la plupart sont estimés sur les données trimestrielles.",
  typeList: CL_SOURCE_CATEGORY,
  abstractLg2:
    "1- Purpose of the quarterly accounts\n\n- Breaking down the previous annual accounts into quarterly accounts:\n\nThe first objective of the quarterly accounts in France is to use monthly or quarterly economic indicators in order to break down annual accounts of the past into quarterly accounts. The aim is to build quarterly series which can be integrated into the national accounts framework. These series refine the diagnostic of economic cycles and give an understanding of the timeframes between events.\n\n- Rapidly provide a macroeconomic description of the present:\n\nBreaking down annual accounts requires that these accounts are known. However, the annual accounts estimates come fairly late: they provide an initial idea of the macroeconomic situation of a given year with the provisional account, published approximately four months after the end of the year in question.\n\nIn the meantime, a large number of short-term indicators are available and start to give an idea of the macroeconomic trends of the recent period. Quarterly national accounts built on these sub-annual data to build the quarterly accounts before the previsional account.\n\nFor example, the industrial production index is the main source of information on the monthly output trends in industry. The quarterisation of past annual output thus relies heavily on this indicator.\n\nLastly, these two characteristics of short-term indicators - quick availability and sources of information on sub-annual dynamics - have given the quarterly accounts a further objective: that of rapidly providing a macroeconomic description of the present (or more accurately, the recent past).\n\nThe method used to quarterise the past accounts is then extended to immediately include the available short-term data and to anticipate the forthcoming annual accounts as best as possible.\n\n2- Use\n\n- Macroeconomic analysis:\n\nThe quarterly accounts have become very useful to economists. Most French macro-econometric models are estimated using the quarterly accounts. Similarly, more specific analyses of economic dynamics, for example the dynamic between prices and wages or between household income and consumption, are often carried out on quarterly accounts data.\n\nUsers should not forget, however, that the quarterisation of the annual accounts is itself a construction which brings multiple data sources into play, as well as numerous statistical tools such as calibrating/benchmarking and seasonal and calendar adjustment. These tools are not always neutral in their effect on the econometric results that may be obtained with these series.\n\n- Short-term analysis:\n\nThe quarterly accounts very quickly became a central feature of short-term analysis. Indeed, there are many short-term economic indicators which are sometimes difficult to interpret. Some of them cover the same scope but may differ for reasons of specific field and data collection type.\n\nIn the field of industrial production, for example, the first information is qualitative and comes from the business surveys. The industrial output index is published a little later and gives quantitative information. Then the turnover indices are published, also giving a quantitative evaluation of monthly industrial activity.\n\nWWhen the indicators do not cover the same scope, the differences may be difficult to disentangle in order to understand short-term trends. For example, in certain months the consumption of non-energy industrial goods rises sharply while the industrial output index shows stability and the customs statistics indicate a drop in exports.\n\nIt is ultimately quite difficult to synthesize all this information. The quarterly accounts unify this information in the framework of the national accounts, and synthesize it in the form of aggregates such as gross domestic product (GDP), gross operating surplus of enterprises, and gross disposable income of households.Quarterly national accounts also provide all the elements of supply and uses for 17 aggregated products (including production, imports, exports, final consumption, investment) and elements of institutional sectors accounts (households, non-financial and financial corporations, general government).\n\n- Forecasts:\n\nThe quarterly accounts often serve as a starting point for forecasting. On the one hand, the purpose of short-term forecasts is precisely to anticipate the forthcoming publications of the quarterly accounts. The INSEE's Conjoncture in France relies on a simplified accounts framework to give figures covering two or three quarters. On the other hand, longer-term forecasts are made using macro-econometric models, most of which are estimated from quarterly data.",
  contributors: [
    {
      id: "CNAMTS",
    },
    {
      id: "DG75-F110",
    },
  ],
  accrualPeriodicityCode: "M",
  id: "s1185",
  family: {
    labelLg2: "Quaterly accounts",
    labelLg1: "Comptes trimestriels",
    id: "s31",
  },
  isReplacedBy: [
    {
      labelLg2: "Unified corporate statistics system",
      labelLg1: "Système unifié de statistiques d'entreprises",
      id: "s1272",
      type: "series",
    },
  ],
};
describe("SerieInformation", () => {
  it("should show the right number of Note component when the second lang is not selected", () => {
    const { container } = renderWithRouter(
      <OperationsSerieVisualization
        attr={attr}
        secondLang={false}
        organisations={organisations}
        langs={{ lg1: "fr" }}
      />,
    );
    expect(container.querySelectorAll(".note")).toHaveLength(15);
  });

  it("should show the right number of Note component when the second lang is selected", () => {
    const { container } = renderWithRouter(
      <OperationsSerieVisualization
        attr={attr}
        secondLang={true}
        organisations={organisations}
        langs={{ lg1: "fr" }}
      />,
    );
    expect(container.querySelectorAll(".note")).toHaveLength(25);
  });
  it("should show the right number of DisplayLinks component", () => {
    const { container } = renderWithRouter(
      <OperationsSerieVisualization
        attr={attr}
        secondLang={true}
        organisations={organisations}
        langs={{ lg1: "fr" }}
      />,
    );
    expect(container.querySelectorAll(".bauhaus-display-links")).toHaveLength(5);
  });

  it("should display the creator", () => {
    const attr2 = {
      ...attr,
      creators: attr.creators[0],
    };
    const { container } = renderWithRouter(
      <OperationsSerieVisualization attr={attr2} secondLang={true} langs={{ lg1: "fr" }} />,
    );
    const creator = container.querySelector("#creators p");
    expect(creator.innerHTML).toEqual("Direction Générale");
  });
  it("should display the publisher", () => {
    const { container } = renderWithRouter(
      <OperationsSerieVisualization attr={attr} secondLang={true} langs={{ lg1: "fr" }} />,
    );
    const publisher = container.querySelector("#publishers p");
    expect(publisher.innerHTML).toEqual("GF3C");
  });
});
