import { useState } from "react";

import { ActionToolbar } from "@components/action-toolbar";
import { TextInput } from "@components/form/input";
import { Row } from "@components/layout";
import { AddLogo } from "@components/logo/logo-add";
import { DelLogo } from "@components/logo/logo-del";
import { Pagination } from "@components/pagination";
import { Panel } from "@components/panel";
import { PickerItem } from "@components/picker-item";

import { filterDeburr } from "@utils/array-utils";

import D from "../../i18n/build-dictionary";
import "../codelist-detail/edit.scss";

const Picker = ({ panelTitle, codes, addAll, removeAll, addAction, removeAction }) => {
  const [searchLabel, setSearchLabel] = useState("");

  const getCodesByStatus = () => {
    const check = filterDeburr(searchLabel);
    return codes.reduce(
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
    <PickerItem key={id} id={id} label={label} logo={AddLogo} handleClick={addAction} />
  ));
  const addedElements = selected.map(({ id, label }) => (
    <PickerItem key={id} id={id} label={label} logo={DelLogo} handleClick={removeAction} />
  ));

  return (
    <div className="container">
      <ActionToolbar>
        <button type="button" className="btn wilco-btn btn-lg col-md-4" onClick={removeAll}>
          {D.removeAll}
        </button>

        <button type="button" className="btn wilco-btn btn-lg col-md-4" onClick={addAll}>
          {D.addAll}
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
            placeholder={D.searchLabelPlaceholder}
          />
          <Pagination itemEls={toAddElements} />
        </div>
      </Row>
    </div>
  );
};

export default Picker;
