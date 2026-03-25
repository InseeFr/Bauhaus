import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { DateItem } from "@components/creation-update-items";
import { getDisseminationStatus } from "@components/dissemination-status/disseminationStatus";
import { InseeOrganisation } from "@components/business/organisations/organisations";

import "../../../../../../i18n";
import { ConceptForAdvancedSearch } from "../../../../../types/concept";
import { DateFilteredTable } from "../../../../../components/DateFilteredTable";

type Props = {
  conceptsData: ConceptForAdvancedSearch[];
  type: "creations" | "modifications";
};

const ConceptsCreationsModifications = ({ conceptsData, type }: Readonly<Props>) => {
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
      globalFilterFields={[
        "label",
        "creator",
        "disseminationStatus",
        dateField,
        "validationStatus",
      ]}
      onRowClick={(concept) => navigate(`/concepts/${concept.id}`)}
    >
      <Column field="label" header={t("dashboard.concepts.labelColumn")} />
      <Column
        field="creator"
        header={t("dashboard.ownerColumn")}
        body={(item: ConceptForAdvancedSearch) => <InseeOrganisation creator={item.creator} />}
      />
      <Column
        field="disseminationStatus"
        header={t("dashboard.concepts.disseminationColumn")}
        body={(item: ConceptForAdvancedSearch) => getDisseminationStatus(item.disseminationStatus)}
      />
      <Column
        field={dateField}
        header={type === "creations" ? t("dashboard.createdColumn") : t("dashboard.modifiedColumn")}
        body={(item: ConceptForAdvancedSearch) => (
          <DateItem date={type === "creations" ? item.created : item.modified} />
        )}
      />
      <Column
        field="validationStatus"
        header={t("dashboard.statusColumn")}
        body={(item: ConceptForAdvancedSearch) =>
          item.validationStatus === "true"
            ? t("dashboard.concepts.statusValid")
            : t("dashboard.statusProvisional")
        }
      />
    </DateFilteredTable>
  );
};

export default ConceptsCreationsModifications;
