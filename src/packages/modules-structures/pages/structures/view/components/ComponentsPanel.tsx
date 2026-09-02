import { useState, useEffect, useCallback } from "react";

import { Codelist } from "@model/Codelist";
import { Component } from "@model/structures/Component";

import { ConceptsApi } from "@sdk/index";

import { EMPTY_ARRAY } from "@utils/array-utils";

import { CodelistPanel } from "../../../../components/CodelistPanel";
import { ComponentSpecificationModal } from "../../../../components/ComponentSpecificationModal";
import { StructureComponentsSelector } from "../../../../components/StructureComponentsSelector";
import { useFormattedCodelist } from "../../../../hooks/useFormattedCodelist";

export const ComponentsPanel = ({ componentDefinitions = EMPTY_ARRAY }) => {
  const [concepts, setConcepts] = useState([]);

  const { data: codelists = [] } = useFormattedCodelist();

  const [modalOpened, setModalOpened] = useState(false);

  const [selectedComponent, setSelectedComponent] = useState<Component>();

  const [codelist, setCodelist] = useState<Codelist | undefined>(undefined);

  const handleCodelistDetail = useCallback((codelist: Codelist) => {
    setCodelist(codelist);
  }, []);

  useEffect(() => {
    ConceptsApi.getConceptList().then(setConcepts);
  }, []);

  const handleSpecificationClick = useCallback((component: Component) => {
    setSelectedComponent(component);
    setModalOpened(true);
  }, []);

  return (
    <div className="row text-left">
      {modalOpened && selectedComponent && (
        <ComponentSpecificationModal
          onClose={() => setModalOpened(false)}
          selectedComponent={selectedComponent}
          structureComponents={componentDefinitions}
          disabled={true}
          specification={{
            attachment: selectedComponent.attachment,
            required: selectedComponent.required,
            notation: selectedComponent.notation,
            labelLg1: selectedComponent.labelLg1,
            labelLg2: selectedComponent.labelLg2,
          }}
        />
      )}
      <StructureComponentsSelector
        componentDefinitions={componentDefinitions}
        handleSpecificationClick={handleSpecificationClick}
        concepts={concepts}
        codelists={codelists}
        readOnly={true}
        handleCodelistDetail={handleCodelistDetail}
      />
      <CodelistPanel
        codelist={codelist}
        isOpen={!!codelist}
        handleBack={() => setCodelist(undefined)}
      />
    </div>
  );
};
