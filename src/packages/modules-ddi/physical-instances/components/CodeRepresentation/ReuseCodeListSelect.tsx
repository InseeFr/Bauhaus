import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useAllCodesLists } from "../../../hooks/useAllCodesLists";

interface ReuseCodeListSelectProps {
  selectedCodeListId: string | null;
  onCodeListSelect: (value: string) => void;
}

export const ReuseCodeListSelect = ({
  selectedCodeListId,
  onCodeListSelect,
}: Readonly<ReuseCodeListSelectProps>) => {
  const { t } = useTranslation();
  const { id: physicalInstanceId = "", agencyId = "" } = useParams<{
    id: string;
    agencyId: string;
  }>();
  const {
    data: codesLists = [],
    isLoading: isLoadingCodesLists,
    error: codesListsError,
  } = useAllCodesLists(agencyId, physicalInstanceId);

  if (isLoadingCodesLists) {
    return (
      <div className="flex gap-2">
        <ProgressSpinner style={{ width: "20px", height: "20px", margin: "0" }} strokeWidth="4" />
        <span>{t("physicalInstance.view.code.loadingCodesLists")}</span>
      </div>
    );
  }

  if (codesListsError) {
    return (
      <Message severity="error" text={t("physicalInstance.view.code.errorLoadingCodesLists")} />
    );
  }

  if (codesLists.length === 0) {
    return <Message severity="info" text={t("physicalInstance.view.code.noCodesListsAvailable")} />;
  }

  return (
    <Dropdown
      filter
      value={selectedCodeListId}
      options={codesLists.map((cl) => ({
        value: `${cl.agencyId}-${cl.id}`,
        label: cl.label,
      }))}
      onChange={(e) => {
        onCodeListSelect(e.value);
      }}
      placeholder={t("physicalInstance.view.code.selectCodeList")}
      className="w-full"
    />
  );
};
