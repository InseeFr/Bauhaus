import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { useTranslation } from "react-i18next";

interface SearchFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  typeOptions: { label: string; value: string }[];
  onNewVariable: () => void;
  onSaveAll?: () => void;
}

export const SearchFilters = ({
  searchValue,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  typeOptions,
  onNewVariable,
  onSaveAll,
}: Readonly<SearchFiltersProps>) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2 mb-3">
      <IconField iconPosition="left" className="flex-1">
        <InputIcon className="pi pi-search"> </InputIcon>
        <InputText
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("physicalInstance.view.search")}
          className="w-full"
          aria-label={t("physicalInstance.view.search")}
        />
      </IconField>

      <Dropdown
        value={typeFilter}
        options={typeOptions}
        onChange={(e) => onTypeFilterChange(e.value)}
        className="flex-1"
        aria-label={t("physicalInstance.view.typeFilter")}
      />
      <Button
        icon="pi pi-save"
        label={t("physicalInstance.view.saveAll")}
        severity="secondary"
        style={{ background: "transparent" }}
        aria-label={t("physicalInstance.view.saveAll")}
        onClick={onSaveAll}
      />
      <Button
        icon="pi pi-plus"
        label={t("physicalInstance.view.newVariable")}
        severity="secondary"
        style={{ background: "transparent" }}
        aria-label={t("physicalInstance.view.newVariable")}
        onClick={onNewVariable}
      />
    </div>
  );
};
