import { Column } from "primereact/column";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { InseeOrganization } from "@components/business/organizations/organizations";
import { DateItem } from "@components/creation-update-items";
import { getDisseminationStatus } from "@components/dissemination-status/disseminationStatus";
import { PublicationMale } from "@components/status";

import "../../../../../i18n";
import { DateFilteredTable } from "../../../../components/DateFilteredTable";
import { ConceptForAdvancedSearch } from "../../../../types/concept";

type Props = {
  conceptsData: ConceptForAdvancedSearch[];
  type: "creations" | "modifications";
};

function ownerBody(item: ConceptForAdvancedSearch) {
  return <InseeOrganization creator={item.creator} />;
}

function disseminationBody(item: ConceptForAdvancedSearch) {
  return getDisseminationStatus(item.disseminationStatus);
}

function dateBody(type: Props["type"]) {
  return (item: ConceptForAdvancedSearch) => (
    <DateItem date={type === "creations" ? item.created : item.modified} />
  );
}

function statusBody(item: ConceptForAdvancedSearch) {
  return <PublicationMale object={{ validationState: item.validationState }} />;
}

export const ConceptsCreationsModifications = ({ conceptsData, type }: Readonly<Props>) => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const dateField = type === "creations" ? "created" : "modified";

  const typeByLang =
    type === "creations" ? t("dashboard.creationsType") : t("dashboard.modificationsType");

  return (
    <DateFilteredTable
      data={conceptsData}
      dateField={dateField}
      typeByLang={typeByLang}
      globalFilterFields={["label", "creator", "disseminationStatus", dateField, "validationState"]}
      onRowClick={(concept) => navigate(`/concepts/${concept.id}`)}
    >
      <Column field="label" header={t("dashboard.concepts.labelColumn")} />
      <Column field="creator" header={t("dashboard.ownerColumn")} body={ownerBody} />
      <Column
        field="disseminationStatus"
        header={t("dashboard.concepts.disseminationColumn")}
        body={disseminationBody}
      />
      <Column
        field={dateField}
        header={type === "creations" ? t("dashboard.createdColumn") : t("dashboard.modifiedColumn")}
        body={dateBody(type)}
      />
      <Column field="validationState" header={t("dashboard.statusColumn")} body={statusBody} />
    </DateFilteredTable>
  );
};
