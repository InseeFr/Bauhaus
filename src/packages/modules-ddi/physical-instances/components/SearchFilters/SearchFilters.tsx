import { useTranslation } from "react-i18next";

import { Button } from "@components/ui/button";
import { Dropdown } from "@components/ui/dropdown";
import { IconField } from "@components/ui/icon-field";
import { InputIcon } from "@components/ui/input-icon";
import { InputText } from "@components/ui/input-text";

import { HasAccess } from "../../../../auth/components/auth";

interface SearchFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  typeOptions: { label: string; value: string }[];
  onNewVariable: () => void;
  /** Ouvre la recherche d'une variable de l'étude à réutiliser (#1387) ; sans étude, pas de bouton. */
  onReuseVariable?: () => void;
  onSaveAll?: () => void;
  hasLocalChanges?: boolean;
  /** Stamps créateurs du groupe parent — gating STAMP des boutons UPDATE. */
  stamps?: string[];
}

export const SearchFilters = ({
  searchValue,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  typeOptions,
  onNewVariable,
  onReuseVariable,
  onSaveAll,
  hasLocalChanges = false,
  stamps,
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
      <HasAccess module="DDI_PHYSICALINSTANCE" privilege="UPDATE" stamps={stamps}>
        <Button
          icon="pi pi-save"
          label={t("physicalInstance.view.saveAll")}
          severity="secondary"
          style={{ background: "transparent" }}
          aria-label={t("physicalInstance.view.saveAll")}
          onClick={onSaveAll}
          disabled={!hasLocalChanges}
        />
      </HasAccess>
      <HasAccess module="DDI_PHYSICALINSTANCE" privilege="UPDATE" stamps={stamps}>
        <Button
          icon="pi pi-plus"
          label={t("physicalInstance.view.newVariable")}
          severity="secondary"
          style={{ background: "transparent" }}
          aria-label={t("physicalInstance.view.newVariable")}
          onClick={onNewVariable}
        />
      </HasAccess>
      {onReuseVariable && (
        <HasAccess module="DDI_PHYSICALINSTANCE" privilege="UPDATE" stamps={stamps}>
          <Button
            icon="pi pi-share-alt"
            label={t("physicalInstance.view.reuseVariable.open")}
            severity="secondary"
            style={{ background: "transparent" }}
            aria-label={t("physicalInstance.view.reuseVariable.open")}
            onClick={onReuseVariable}
          />
        </HasAccess>
      )}
    </div>
  );
};
