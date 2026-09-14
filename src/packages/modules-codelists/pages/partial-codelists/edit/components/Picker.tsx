import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ActionToolbar } from "@components/action-toolbar";
import { TextInput } from "@components/form/input";
import { Row } from "@components/layout";
import { AddLogo } from "@components/logo/logo-add";
import { DelLogo } from "@components/logo/logo-del";
import { Pagination } from "@components/pagination";
import { Panel } from "@components/panel";
import { PickerItem } from "@components/picker-item";

import { filterDeburr } from "@utils/array-utils";

import "../../../../pages/codelists/edit/components/CodelistDetailEdit.css";
import { partialInGlobalCodes } from "../../../../utils/partialInGlobalCodes";

/** Code de la liste globale, marqué selon son appartenance à la liste partielle
 * (retour de `partialInGlobalCodes`, consommé ici pour piloter le picker). */
export type PickerCode = ReturnType<typeof partialInGlobalCodes>[number];

interface PickerTypes {
  panelTitle: string;
  codes: PickerCode[];
  addAll: VoidFunction;
  removeAll: VoidFunction;
  addAction: (code: string) => void;
  removeAction: (code: string) => void;
}

export const Picker = ({
  panelTitle,
  codes,
  addAll,
  removeAll,
  addAction,
  removeAction,
}: Readonly<PickerTypes>) => {
  const { t } = useTranslation();

  const [searchLabel, setSearchLabel] = useState("");

  const getCodesByStatus = () => {
    const check = filterDeburr(searchLabel);
    return codes.reduce<{
      toSelect: { id: string; label: string }[];
      selected: { id: string; label: string }[];
    }>(
      (byStatus, { id, label, isPartial }) => {
        if (isPartial) byStatus.selected.push({ id, label });
        else if (check(label)) {
          byStatus.toSelect.push({ id, label });
        }
        return byStatus;
      },
      { toSelect: [], selected: [] },
    );
  };

  const { toSelect, selected } = getCodesByStatus();

  const toAddElements = toSelect.map(({ id, label }) => (
    <PickerItem
      key={id}
      id={id}
      label={label}
      logo={AddLogo as unknown as JSX.Element}
      handleClick={addAction}
    />
  ));

  const addedElements = selected.map(({ id, label }) => (
    <PickerItem
      key={id}
      id={id}
      label={label}
      logo={DelLogo as unknown as JSX.Element}
      handleClick={removeAction}
    />
  ));

  return (
    <div className="container">
      <ActionToolbar>
        <button type="button" className="btn wilco-btn btn-lg col-md-4" onClick={removeAll}>
          {t("partial-codelists.removeAllCodes")}
        </button>
        <button type="button" className="btn wilco-btn btn-lg col-md-4" onClick={addAll}>
          {t("partial-codelists.addAllCodes")}
        </button>
      </ActionToolbar>
      <Row>
        <div className="col-md-6">
          <Panel title={panelTitle}>{addedElements}</Panel>
        </div>
        <div className="col-md-6 text-center">
          <TextInput
            value={searchLabel}
            onChange={(e) => setSearchLabel(e.target.value)}
            placeholder={t("partial-codelists.codesPlaceholder")}
          />
          <Pagination itemEls={toAddElements} />
        </div>
      </Row>
    </div>
  );
};
