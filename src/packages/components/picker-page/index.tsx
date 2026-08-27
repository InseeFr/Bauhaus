import { useState } from "react";

import { PickList } from "primereact/picklist";

import { ErrorBloc } from "@components/errors-bloc";
import { PageTitle } from "@components/page-title";

import D from "../i18n";
import { ActionToolbar } from "../action-toolbar";
import { ReturnButton } from "../buttons/buttons-with-icons";

interface Item {
  id: string;
  label: string;
}

/**
 * Un intitulé de panneau est soit fixe, soit dépendant du nombre d'éléments qu'il
 * contient — les libellés i18n des pages de publication comportent un `{{size}}`.
 */
type PanelTitle = string | ((size: number) => string);

const resolvePanelTitle = (title: PanelTitle | undefined, size: number) =>
  typeof title === "function" ? title(size) : title;

// La PickList filtre sur `label` : un libellé absent la ferait échouer.
const withSafeLabels = (items: Item[]): Item[] =>
  (items ?? []).map(({ id, label }) => ({ id, label: label ?? "" }));

interface PickerTypes {
  items: Item[];
  handleAction: (ids: string[]) => void;
  title: string;
  panelTitle: PanelTitle;
  availablePanelTitle?: PanelTitle;
  labelWarning: string;
  context: string;
  ValidationButton: React.ComponentType<{
    action: () => void;
    disabled: boolean;
    selectedIds: string[];
  }>;
  disabled?: boolean;
  disabledWarningMessage?: string;
  serverSideError?: string;
}

export const Picker = ({
  items: itemsProps,
  handleAction,
  title,
  panelTitle,
  availablePanelTitle,
  labelWarning,
  context,
  ValidationButton,
  disabled,
  disabledWarningMessage,
  serverSideError,
}: Readonly<PickerTypes>) => {
  const [availableItems, setAvailableItems] = useState<Item[]>(() => withSafeLabels(itemsProps));
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [clientSideErrors, setClientSideErrors] = useState("");

  const selectedIds = selectedItems.map(({ id }) => id);

  const handleClickValid = () => {
    if (selectedItems.length === 0) {
      setClientSideErrors(labelWarning);
      return;
    }
    handleAction(selectedIds);
  };

  return (
    <div>
      <div className="container">
        <PageTitle title={title} />
        <ActionToolbar>
          <ReturnButton action={`/${context}`} />
          <ValidationButton
            action={handleClickValid}
            disabled={!!clientSideErrors}
            selectedIds={selectedIds}
          />
        </ActionToolbar>
        <ErrorBloc error={clientSideErrors} />
        <ErrorBloc error={serverSideError} />
        {disabled && <ErrorBloc error={disabledWarningMessage} />}
        <PickList
          dataKey="id"
          source={availableItems}
          target={selectedItems}
          onChange={(event) => {
            // PrimeReact type les deux listes en `any` : on rétablit le type au passage.
            setAvailableItems(event.source as Item[]);
            setSelectedItems(event.target as Item[]);
            setClientSideErrors("");
          }}
          itemTemplate={(item: Item) => item.label}
          sourceHeader={resolvePanelTitle(
            availablePanelTitle ?? D.availableItemsPanelTitle,
            availableItems.length,
          )}
          targetHeader={resolvePanelTitle(panelTitle, selectedItems.length)}
          filter
          filterBy="label"
          sourceFilterPlaceholder={D.searchLabelPlaceholder}
          targetFilterPlaceholder={D.searchLabelPlaceholder}
          showSourceControls={false}
          showTargetControls={false}
          sourceStyle={{ height: "20rem" }}
          targetStyle={{ height: "20rem" }}
        />
      </div>
    </div>
  );
};
