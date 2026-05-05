import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { DateItem } from "@components/creation-update-items";
import { InseeOrganisation } from "@components/business/organisations/organisations";

import "../../../../../../i18n";
import { Collection } from "../../../../../types/collection";
import { DateFilteredTable } from "../../../../../components/DateFilteredTable";

type Props = {
  collectionsData: Collection[];
  type: "creations" | "modifications";
};

const CollectionsCreationsModifications = ({ collectionsData, type }: Readonly<Props>) => {
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
      globalFilterFields={["label", "nbMembers", "creator", dateField, "isValidated"]}
      onRowClick={(collection) => navigate(`/concepts/collections/${collection.id}`)}
    >
      <Column field="label" header={t("dashboard.collections.labelColumn")} />
      <Column field="nbMembers" header={t("dashboard.collections.membersColumn")} />
      <Column
        field="creator"
        header={t("dashboard.ownerColumn")}
        body={(item: Collection) => <InseeOrganisation creator={item.creator} />}
      />
      <Column
        field={dateField}
        header={type === "creations" ? t("dashboard.createdColumn") : t("dashboard.modifiedColumn")}
        body={(item: Collection) => (
          <DateItem date={type === "creations" ? item.created : item.modified} />
        )}
      />
      <Column
        field="isValidated"
        header={t("dashboard.statusColumn")}
        body={(item: Collection) =>
          item.isValidated
            ? t("dashboard.collections.statusValid")
            : t("dashboard.statusProvisional")
        }
      />
    </DateFilteredTable>
  );
};

export default CollectionsCreationsModifications;
