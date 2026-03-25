import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SelectButton, SelectButtonChangeEvent } from "primereact/selectbutton";
import { TabPanel, TabView } from "primereact/tabview";

import { PageTitle } from "@components/page-title";

import { useTitle } from "../../../../utils/hooks/useTitle";
import { Collection } from "../../../types/collection";
import { ConceptForAdvancedSearch } from "../../../types/concept";
import CollectionsCreationsModifications from "./collections/creations-modifications/creations-modification";
import CollectionsSummary from "./collections/summary/summary";
import ConceptsCreationsModifications from "./concepts/creations-modifications/creations-modifications";
import ConceptsSummary from "./concepts/summary/summary";
import { Menu } from "./menu";
import "../../../i18n";

type Props = {
  conceptsData: ConceptForAdvancedSearch[];
  collectionsData: Collection[];
};

type ViewType = "summary" | "creations" | "modifications";

function ConceptsDashboard({ conceptsData, collectionsData }: Readonly<Props>) {
  const { t } = useTranslation();
  useTitle(t("dashboard.conceptsTab"), t("dashboard.administrationTitle"));

  const [conceptsView, setConceptsView] = useState<ViewType>("summary");
  const [collectionsView, setCollectionsView] = useState<ViewType>("summary");

  const viewOptions = [
    { label: t("dashboard.summaryTab"), value: "summary" },
    { label: t("dashboard.creationsTab"), value: "creations" },
    { label: t("dashboard.modificationsTab"), value: "modifications" },
  ];

  return (
    <div className="container">
      <PageTitle title={t("dashboard.pageTitle")} />
      <Menu />
      <TabView>
        <TabPanel header={t("dashboard.conceptsTab")}>
          <SelectButton
            value={conceptsView}
            onChange={(e: SelectButtonChangeEvent) => setConceptsView(e.value)}
            options={viewOptions}
          />
          {conceptsView === "summary" && <ConceptsSummary conceptsData={conceptsData} />}
          {conceptsView === "creations" && (
            <ConceptsCreationsModifications conceptsData={conceptsData} type="creations" />
          )}
          {conceptsView === "modifications" && (
            <ConceptsCreationsModifications conceptsData={conceptsData} type="modifications" />
          )}
        </TabPanel>
        <TabPanel header={t("dashboard.collectionsTab")}>
          <SelectButton
            value={collectionsView}
            onChange={(e: SelectButtonChangeEvent) => setCollectionsView(e.value)}
            options={viewOptions}
          />
          {collectionsView === "summary" && (
            <CollectionsSummary collectionsData={collectionsData} />
          )}
          {collectionsView === "creations" && (
            <CollectionsCreationsModifications collectionsData={collectionsData} type="creations" />
          )}
          {collectionsView === "modifications" && (
            <CollectionsCreationsModifications
              collectionsData={collectionsData}
              type="modifications"
            />
          )}
        </TabPanel>
      </TabView>
    </div>
  );
}

export default ConceptsDashboard;
