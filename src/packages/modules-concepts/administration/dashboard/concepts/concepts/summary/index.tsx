import { Column } from "primereact/column";

import { DataTable } from "@components/datatable";
import { Panel } from "@components/panel";

import { today } from "@utils/date-utils";

import D from "../../../../../../deprecated-locales";
import { buildDataStamps } from "./stamps-data";
import { buildData } from "./summary-data";

interface ConceptData {
  altLabel: "";
  created: string;
  creator: string;
  definition: string;
  disseminationStatus: string;
  id: string;
  isTopConceptOf: boolean;
  label: string;
  modified: string;
  valid: string;
  validationStatus: boolean;
}
function ConceptsSummary({ conceptsData }: Readonly<{ conceptsData: ConceptData[] }>) {
  const data = buildData(conceptsData);
  const dataStamps = buildDataStamps(conceptsData);
  return (
    <div>
      <h3 className="text-center">
        {D.dashboardConceptsSummaryTitle} {today()}
      </h3>

      <Panel>
        <DataTable value={data} withPagination={false}>
          <Column field="type" header=""></Column>
          <Column field="total" header={D.totalTitle}></Column>
          <Column field="generic" header={D.DSPublicGeneriqueTitle}></Column>
          <Column field="specific" header={D.DSPublicSpecifiqueTitle}></Column>
          <Column field="private" header={D.DSPrivateTitle}></Column>
        </DataTable>
      </Panel>

      <Panel>
        <DataTable value={dataStamps} globalFilterFields={["stamp"]}>
          <Column field="stamp" header={D.dashboardConceptsByCreatorTitle}></Column>
          <Column field="total" header={D.totalTitle}></Column>
          <Column field="generic" header={D.DSPublicGeneriqueTitle}></Column>
          <Column field="specific" header={D.DSPublicSpecifiqueTitle}></Column>
          <Column field="private" header={D.DSPrivateTitle}></Column>
        </DataTable>
      </Panel>
    </div>
  );
}

export default ConceptsSummary;
