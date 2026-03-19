import { Column } from "primereact/column";
import { useTranslation } from "react-i18next";

import { DataTable } from "@components/datatable";
import { Panel } from "@components/panel";
import { InseeOrganisation } from "@components/business/organisations/organisations";

import { today } from "@utils/date-utils";

import "../../../../../../i18n";
import { ConceptForAdvancedSearch } from "../../../../../types/concept";

type ConceptSummaryRow = {
  id: number;
  type: string;
  total: number;
  generic: number;
  specific: number;
  private: number;
};

type Counts = Omit<ConceptSummaryRow, "id" | "type">;

const emptyCounts = (): Counts => ({ total: 0, generic: 0, specific: 0, private: 0 });

export const buildData = (
  d: ConceptForAdvancedSearch[],
  labels: [string, string, string, string] = ["", "", "", ""],
): ConceptSummaryRow[] => {
  const all = emptyCounts();
  const top = emptyCounts();
  const provisional = emptyCounts();
  const validDate = emptyCounts();

  for (const concept of d) {
    const isGeneric = concept.disseminationStatus.endsWith("PublicGenerique");
    const isSpecific = concept.disseminationStatus.endsWith("PublicSpecifique");
    const isPrivate = concept.disseminationStatus.endsWith("Prive");

    const increment = (counts: Counts) => {
      counts.total++;
      if (isGeneric) counts.generic++;
      if (isSpecific) counts.specific++;
      if (isPrivate) counts.private++;
    };

    increment(all);
    if (concept.isTopConceptOf === "true") increment(top);
    if (concept.validationStatus === "false") increment(provisional);
    if (concept.valid) increment(validDate);
  }

  return [
    { id: 1, type: labels[0], ...all },
    { id: 2, type: labels[1], ...top },
    { id: 3, type: labels[2], ...provisional },
    { id: 4, type: labels[3], ...validDate },
  ];
};

type ConceptStampRow = {
  stamp: string;
  total: number;
  generic: number;
  specific: number;
  private: number;
};

export const buildDataStamps = (d: ConceptForAdvancedSearch[]): ConceptStampRow[] =>
  d.reduce<ConceptStampRow[]>((acc, concept) => {
    if (!acc.some((row) => row.stamp === concept.creator)) {
      acc.push({ stamp: concept.creator, total: 0, generic: 0, specific: 0, private: 0 });
    }
    const row = acc.find((row) => row.stamp === concept.creator)!;
    row.total++;
    if (concept.disseminationStatus.endsWith("PublicGenerique")) row.generic++;
    if (concept.disseminationStatus.endsWith("PublicSpecifique")) row.specific++;
    if (concept.disseminationStatus.endsWith("Prive")) row.private++;
    return acc;
  }, []);

function ConceptsSummary({ conceptsData }: Readonly<{ conceptsData: ConceptForAdvancedSearch[] }>) {
  const { t } = useTranslation();

  const data = buildData(conceptsData, [
    t("dashboard.concepts.summary.conceptsCountLabel"),
    t("dashboard.concepts.summary.topConceptsCountLabel"),
    t("dashboard.provisionalCountLabel"),
    t("dashboard.concepts.summary.validDateCountLabel"),
  ]);
  const dataStamps = buildDataStamps(conceptsData);

  return (
    <div>
      <h3 className="text-center">
        {t("dashboard.concepts.summary.title")} {today()}
      </h3>

      <Panel>
        <DataTable value={data} withPagination={false}>
          <Column field="type" header=""></Column>
          <Column field="total" header={t("dashboard.totalColumn")}></Column>
          <Column field="generic" header={t("dashboard.concepts.summary.genericColumn")}></Column>
          <Column field="specific" header={t("dashboard.concepts.summary.specificColumn")}></Column>
          <Column field="private" header={t("dashboard.concepts.summary.privateColumn")}></Column>
        </DataTable>
      </Panel>

      <Panel>
        <DataTable value={dataStamps} globalFilterFields={["stamp"]}>
          <Column
            field="stamp"
            header={t("dashboard.concepts.summary.byOwnerColumn")}
            body={(row: ConceptStampRow) => <InseeOrganisation creator={row.stamp} />}
          ></Column>
          <Column field="total" header={t("dashboard.totalColumn")}></Column>
          <Column field="generic" header={t("dashboard.concepts.summary.genericColumn")}></Column>
          <Column field="specific" header={t("dashboard.concepts.summary.specificColumn")}></Column>
          <Column field="private" header={t("dashboard.concepts.summary.privateColumn")}></Column>
        </DataTable>
      </Panel>
    </div>
  );
}

export default ConceptsSummary;
