import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { AddButton } from "@components/buttons/add";
import { SeeButton } from "@components/buttons/see";
import { RightSlidingPanel } from "@components/sliding-panel";

import { UNPUBLISHED } from "@model/ValidationState";

import { typeUriToLabel } from "../utils/typeUriToLabel";
import { CollapsiblePanel } from "./CollapsiblePanel";
import { ComponentDetail } from "./ComponentDetail";
import { ComponentsTable } from "./ComponentsTable";
import { Representation } from "./Representation";

export const MutualizedComponentsSelector = ({
  hidden = false,
  components,
  handleAdd,
  concepts,
  codelists,
  handleCodelistDetail,
}) => {
  const { t } = useTranslation();

  const [openPanel, setOpenPanel] = useState(false);

  const [selectedComponent, setSelectedComponent] = useState(null);

  const seeClickHandler = useCallback(
    (e) => {
      const component = components.find(
        (c) => c.identifiant === e.target.parentElement.dataset.componentId,
      );
      setSelectedComponent(component);
      setOpenPanel(true);
    },
    [components],
  );

  const addClickHandler = useCallback(
    (e) => {
      handleAdd(e.target.parentElement.dataset.componentId);
    },
    [handleAdd],
  );

  const componentsWithActions = components.map((component) => ({
    ...component,
    type: typeUriToLabel(component.type),
    mutualized:
      !!component.validationState && component.validationState !== UNPUBLISHED ? (
        <span className="glyphicon glyphicon-ok" aria-label={t("component.mutualized")}></span>
      ) : (
        <></>
      ),
    concept: concepts.find(({ id }) => component.concept?.toString().includes(id?.toString()))
      ?.label,
    representation: (
      <Representation
        component={component}
        codelists={codelists}
        handleCodelistDetail={() => {
          const codelist = codelists.find(
            ({ id }) => id?.toString() === component.codeList?.toString(),
          );
          handleCodelistDetail(codelist);
        }}
      />
    ),
    actions: (
      <>
        <SeeButton data-component-id={component.identifiant} onClick={seeClickHandler} />
        <AddButton data-component-id={component.identifiant} onClick={addClickHandler} />
      </>
    ),
  }));

  return (
    <CollapsiblePanel
      id="mutualized-components-picker"
      hidden={hidden}
      title={t("component.mutualizedComponents") + " "}
    >
      <ComponentsTable components={componentsWithActions} />
      <RightSlidingPanel isOpen={openPanel} onHide={() => setOpenPanel(false)}>
        <ComponentDetail
          component={selectedComponent}
          codelists={codelists}
          concepts={concepts}
          handleSave={() => {}}
          handleBack={() => {
            setOpenPanel(false);
          }}
          readOnly={true}
          mutualized={true}
        />
      </RightSlidingPanel>
    </CollapsiblePanel>
  );
};
