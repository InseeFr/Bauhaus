import { useCallback, useState } from "react";

import { AddButton } from "@components/buttons/add";
import { SeeButton } from "@components/buttons/see";
import { RightSlidingPanel } from "@components/sliding-panel";

import { UNPUBLISHED } from "../../../model/ValidationState";
import D from "../../i18n/build-dictionary";
import { typeUriToLabel } from "../../utils";
import { CollapsiblePanel } from "../collapsible-panel";
import { ComponentDetail } from "../component-detail";
import { ComponentsTable } from "../components-table";
import Representation from "../representation";

export const MutualizedComponentsSelector = ({
  hidden = false,
  components,
  handleAdd,
  concepts,
  codesLists,
  handleCodesListDetail,
}) => {
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
        <span className="glyphicon glyphicon-ok" aria-label={D.mutualized}></span>
      ) : (
        <></>
      ),
    concept: concepts.find(({ id }) => component.concept?.toString().includes(id?.toString()))
      ?.label,
    representation: (
      <Representation
        component={component}
        codesLists={codesLists}
        handleCodesListDetail={() => {
          const codesList = codesLists.find(
            ({ id }) => id?.toString() === component.codeList?.toString(),
          );
          handleCodesListDetail(codesList);
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
      title={D.mutualizedComponentTitle}
    >
      <ComponentsTable components={componentsWithActions} />

      <RightSlidingPanel isOpen={openPanel} backdropClicked={() => setOpenPanel(false)}>
        <ComponentDetail
          component={selectedComponent}
          codesLists={codesLists}
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
