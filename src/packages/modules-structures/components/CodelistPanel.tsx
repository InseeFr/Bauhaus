import { useTranslation } from "react-i18next";

import { ActionToolbar } from "@components/action-toolbar";
import { RightSlidingPanel } from "@components/sliding-panel";
import { List } from "@components/ui/list-group";

import { Codelist } from "@model/Codelist";

import { useAllCodes } from "@utils/hooks/codelist";

import "./CodelistPanel.css";

interface CodelistPanelTypes {
  isOpen: boolean;
  handleBack: VoidFunction;
  codelist?: Codelist;
}

export const CodelistPanel = ({ isOpen, handleBack, codelist }: CodelistPanelTypes) => {
  const { t } = useTranslation();

  const { data: codes } = useAllCodes(codelist?.notation, isOpen);

  if (!codes) {
    return null;
  }

  return (
    <RightSlidingPanel
      panelClassName="code-list-panel"
      isOpen={isOpen}
      onHide={handleBack}
      size={30}
    >
      <ActionToolbar>
        <div className="col-md-12">
          <button type="button" className="btn wilco-btn btn-lg col-md-12" onClick={handleBack}>
            {t("cancel")}
          </button>
        </div>
      </ActionToolbar>
      <List.Container>
        {codes.map(({ code, labelLg1 }) => {
          return (
            <List.Item key={code}>
              {code} - {labelLg1}
            </List.Item>
          );
        })}
      </List.Container>
    </RightSlidingPanel>
  );
};
