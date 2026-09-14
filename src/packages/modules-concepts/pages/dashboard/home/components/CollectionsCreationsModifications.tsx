import { Column } from "primereact/column";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { InseeOrganization } from "@components/business/organizations/organizations";
import { DateItem } from "@components/creation-update-items";
import { PublicationFemale } from "@components/status";

import "../../../../../i18n";
import { CollectionDashboardItem } from "@model/concepts/collection";

import { DateFilteredTable } from "../../../../components/DateFilteredTable";

type Props = {
  collectionsData: CollectionDashboardItem[];
  type: "creations" | "modifications";
};

function ownerBody(item: CollectionDashboardItem) {
  return <InseeOrganization creator={item.creator} />;
}

function dateBody(type: Props["type"]) {
  return (item: CollectionDashboardItem) => (
    <DateItem date={type === "creations" ? item.created : item.modified} />
  );
}

function statusBody(item: CollectionDashboardItem) {
  return <PublicationFemale object={{ validationState: item.validationState }} />;
}

export const CollectionsCreationsModifications = ({ collectionsData, type }: Readonly<Props>) => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const dateField = type === "creations" ? "created" : "modified";

  const typeByLang =
    type === "creations" ? t("dashboard.creationsType") : t("dashboard.modificationsType");

  return (
    <DateFilteredTable
      data={collectionsData}
      dateField={dateField}
      typeByLang={typeByLang}
      globalFilterFields={["label", "nbMembers", "creator", dateField, "validationState"]}
      onRowClick={(collection) => navigate(`/concepts/collections/${collection.id}`)}
    >
      <Column field="label" header={t("dashboard.collections.labelColumn")} />
      <Column field="nbMembers" header={t("dashboard.collections.membersColumn")} />
      <Column field="creator" header={t("dashboard.ownerColumn")} body={ownerBody} />
      <Column
        field={dateField}
        header={type === "creations" ? t("dashboard.createdColumn") : t("dashboard.modifiedColumn")}
        body={dateBody(type)}
      />
      <Column field="validationState" header={t("dashboard.statusColumn")} body={statusBody} />
    </DateFilteredTable>
  );
};
