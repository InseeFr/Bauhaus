import { Column } from "primereact/column";
import { useTranslation } from "react-i18next";

import { DataTable } from "@components/datatable";
import { Panel } from "@components/panel";
import { InseeOrganisation } from "@components/business/organisations/organisations";

import { today } from "@utils/date-utils";

import "../../../../../../i18n";
import { Collection } from "../../../../../types/collection";

type CollectionSummaryRow = {
  id: number;
  type: string;
  total: number;
};

export type CollectionStampRow = {
  stamp: string;
  total: number;
};

export const buildDataStamps = (d: Collection[]): CollectionStampRow[] =>
  d.reduce<CollectionStampRow[]>((acc, collection) => {
    if (!acc.some((row) => row.stamp === collection.creator)) {
      acc.push({ stamp: collection.creator, total: 0 });
    }
    acc.find((row) => row.stamp === collection.creator)!.total++;
    return acc;
  }, []);

function CollectionsSummary({ collectionsData }: Readonly<{ collectionsData: Collection[] }>) {
  const { t } = useTranslation();

  const data: CollectionSummaryRow[] = [
    {
      id: 1,
      type: t("dashboard.collections.summary.collectionsCountLabel"),
      total: collectionsData.length,
    },
    {
      id: 2,
      type: t("dashboard.provisionalCountLabel"),
      total: collectionsData.filter((c) => !c.isValidated).length,
    },
  ];
  const dataStamps = buildDataStamps(collectionsData);

  return (
    <div>
      <h3 className="text-center">
        {t("dashboard.collections.summary.title")} {today()}
      </h3>

      <Panel>
        <DataTable value={data} withPagination={false}>
          <Column field="type" header=""></Column>
          <Column field="total" header={t("dashboard.totalColumn")}></Column>
        </DataTable>
      </Panel>

      <Panel>
        <DataTable value={dataStamps} globalFilterFields={["stamp"]}>
          <Column
            field="stamp"
            header={t("dashboard.collections.summary.byOwnerColumn")}
            body={(row: CollectionStampRow) => <InseeOrganisation creator={row.stamp} />}
          ></Column>
          <Column field="total" header={t("dashboard.totalColumn")}></Column>
        </DataTable>
      </Panel>
    </div>
  );
}

export default CollectionsSummary;
