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

interface CodeListOption {
  value: string;
  label: string;
  mutualized: boolean;
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

  const toOption = (cl: (typeof codesLists)[number]): CodeListOption => ({
    value: `${cl.agencyId}-${cl.id}`,
    label: cl.label,
    mutualized: Boolean(cl.mutualized),
  });

  const groupedOptions = [
    {
      label: t("physicalInstance.view.code.groupCodesListsSection"),
      items: codesLists.filter((cl) => !cl.mutualized).map(toOption),
    },
    {
      label: t("physicalInstance.view.code.mutualizedCodesListsSection"),
      items: codesLists.filter((cl) => cl.mutualized).map(toOption),
    },
  ].filter((group) => group.items.length > 0);

  const itemTemplate = (option: CodeListOption) => (
    <div className="flex align-items-center justify-content-between gap-2">
      <span>{option.label}</span>
      {option.mutualized && (
        <i
          className="pi pi-lock"
          data-testid="mutualized-lock"
          title={t("physicalInstance.view.code.mutualizedReadOnly")}
        />
      )}
    </div>
  );

  return (
    <Dropdown
      filter
      value={selectedCodeListId}
      options={groupedOptions}
      optionLabel="label"
      optionValue="value"
      optionGroupLabel="label"
      optionGroupChildren="items"
      itemTemplate={itemTemplate}
      onChange={(e) => {
        onCodeListSelect(e.value);
      }}
      placeholder={t("physicalInstance.view.code.selectCodeList")}
      className="w-full"
    />
  );
};
