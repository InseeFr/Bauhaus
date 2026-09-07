import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { PageTitle } from "@components/page-title";
import { SummaryEntry, SummaryNav } from "@components/summary-nav";

import { useUrlSection } from "@utils/hooks/useUrlSection";

import { useTitle } from "../../../../../utils/hooks/useTitle";
import { Collection } from "../../../../types/collection";
import { ConceptForAdvancedSearch } from "../../../../types/concept";
import {
  DashboardTab,
  DashboardView,
  dashboardSectionKey,
  resolveDashboardSection,
} from "../../../../utils/dashboardSection";
import CollectionsCreationsModifications from "./CollectionsCreationsModifications";
import CollectionsSummary from "./CollectionsSummary";
import ConceptsCreationsModifications from "./ConceptsCreationsModifications";
import ConceptsSummary from "./ConceptsSummary";
import "./ConceptsDashboard.css";
import "../../../../i18n";

type Props = {
  conceptsData: ConceptForAdvancedSearch[];
  collectionsData: Collection[];
};

function ConceptsDashboard({ conceptsData, collectionsData }: Readonly<Props>) {
  const { t } = useTranslation();
  useTitle(t("dashboard.conceptsTab"), t("dashboard.administrationTitle"));

  const [section, setSection] = useUrlSection("concepts");
  const { tab, view } = resolveDashboardSection(section);

  const tabs: { key: DashboardTab; label: string }[] = [
    { key: "concepts", label: t("dashboard.conceptsTab") },
    { key: "collections", label: t("dashboard.collectionsTab") },
  ];
  const views: { key: DashboardView; label: string }[] = [
    { key: "summary", label: t("dashboard.summaryTab") },
    { key: "creations", label: t("dashboard.creationsTab") },
    { key: "modifications", label: t("dashboard.modificationsTab") },
  ];

  const entries: SummaryEntry[] = tabs.map(({ key, label }) => ({
    key,
    label,
    items: views.map((v) => ({ key: dashboardSectionKey(key, v.key), label: v.label })),
  }));

  const sections: Record<DashboardTab, Record<DashboardView, ReactNode>> = {
    concepts: {
      summary: <ConceptsSummary conceptsData={conceptsData} />,
      creations: <ConceptsCreationsModifications conceptsData={conceptsData} type="creations" />,
      modifications: (
        <ConceptsCreationsModifications conceptsData={conceptsData} type="modifications" />
      ),
    },
    collections: {
      summary: <CollectionsSummary collectionsData={collectionsData} />,
      creations: (
        <CollectionsCreationsModifications collectionsData={collectionsData} type="creations" />
      ),
      modifications: (
        <CollectionsCreationsModifications collectionsData={collectionsData} type="modifications" />
      ),
    },
  };

  return (
    <div className="container">
      <PageTitle title={t("dashboard.pageTitle")} />
      <div className="concepts-dashboard">
        <SummaryNav
          label={t("dashboard.pageTitle")}
          entries={entries}
          activeKeys={[tab, dashboardSectionKey(tab, view)]}
          onSelect={setSection}
        />
        <section className="concepts-dashboard__section">{sections[tab][view]}</section>
      </div>
    </div>
  );
}

export default ConceptsDashboard;
