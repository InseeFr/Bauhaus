import { useTranslation } from "react-i18next";

import { ActionToolbar } from "@components/action-toolbar";
import { RightSlidingPanel } from "@components/sliding-panel";
import { List } from "@components/ui/list-group";

import { useAllCodes } from "@utils/hooks/codeslist";

import { CodesList } from "../../model/CodesList";
import "./CodelistPanel.css";

interface CodelistPanelTypes {
  isOpen: boolean;
  handleBack: VoidFunction;
  codesList?: CodesList;
}

export const CodelistPanel = ({ isOpen, handleBack, codesList }: CodelistPanelTypes) => {
  const { t } = useTranslation();

  const { data: codes } = useAllCodes(codesList?.notation, isOpen);

  if (!codes) {
    return null;
  }

  return (
    <RightSlidingPanel panelClassName="codes-list-panel" isOpen={isOpen} size={30}>
      {/* Le panneau n'accepte qu'un enfant : ce fragment les regroupe sans rien ajouter au DOM. */}
      <>
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
      </>
    </RightSlidingPanel>
  );
};
