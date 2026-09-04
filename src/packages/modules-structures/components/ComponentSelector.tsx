import { useState, useCallback, useEffect, useMemo } from "react";

import { Codelists } from "@model/Codelist";
import { Component, ComponentDefinition } from "@model/structures/Component";
import { Structure } from "@model/structures/Structure";

import { StructureApi } from "@sdk/index";

import { EMPTY_ARRAY } from "@utils/array-utils";

import {
  OBSERVATION,
  ATTRIBUTE_PROPERTY_TYPE,
  ATTRIBUTE_TYPE,
  DIMENSION_PROPERTY_TYPE,
  MEASURE_PROPERTY_TYPE,
} from "../constants";
import { CodelistPanel } from "./CodelistPanel";
import { ComponentSpecificationModal } from "./ComponentSpecificationModal";
import { MutualizedComponentsSelector } from "./MutualizedComponentsSelector";
import { StructureComponentsSelector } from "./StructureComponentsSelector";
import "./ComponentSelector.css";

// A `ComponentDefinition` whose `component` also carries the attribute specification fields
// (`attachment`, `required`, ...) that `saveSpecification` merges onto it below.
type StructureComponent = ComponentDefinition & { attachment?: string[] };

// Grouping of structure components by their component type (dimension / measure / attribute),
// used as an intermediate shape while reordering or splitting them.
type ComponentsByType = Record<string, StructureComponent[]>;

interface ComponentSelectorTypes {
  componentDefinitions: ComponentDefinition[];
  mutualizedComponents: Component[];
  concepts?: any;
  codelists?: Codelists;
  handleUpdate: (components: StructureComponent[]) => void;
  type?: string;
  structure?: Structure;
}

const filterComponentDefinition = (type?: string) => (componentDefinition: ComponentDefinition) =>
  componentDefinition?.component?.type === type;

const filterComponent = (type?: string) => (component: Component) => component?.type === type;

export const ComponentSelector = ({
  componentDefinitions,
  mutualizedComponents,
  concepts = EMPTY_ARRAY,
  codelists = EMPTY_ARRAY,
  handleUpdate,
  type,
  structure,
}: Readonly<ComponentSelectorTypes>) => {
  const [codelistNotation, setCodelistNotation] = useState<any>(undefined);

  const handleCodelistDetail = useCallback((notation: any) => {
    setCodelistNotation(notation);
  }, []);

  const [structureComponents, setStructureComponents] = useState<StructureComponent[]>([]);

  const [modalOpened, setModalOpened] = useState(false);

  // Holds either a `Component` (when opened from `_handleAttributeComponent`) or the
  // `StructureComponent`'s `component` fields spread onto the specification being edited
  // (see `saveSpecification`); its shape genuinely varies by call site.
  const [selectedComponent, setSelectedComponent] = useState<any>({});

  useEffect(() => {
    setStructureComponents(componentDefinitions);
  }, [componentDefinitions]);

  const filteredMutualizedComponents = useMemo(() => {
    return mutualizedComponents.filter(filterComponent(type)).filter((component) => {
      return !structureComponents.find(({ component: c }) => c.id === component.id);
    });
  }, [mutualizedComponents, structureComponents, type]);

  const handleSpecificationClick = useCallback((component: any) => {
    setSelectedComponent(component);
    setModalOpened(true);
  }, []);

  const handleCreateOrUpdate = useCallback(
    (components: StructureComponent[], isCreation: boolean, component: StructureComponent) => {
      if (isCreation) {
        const componentsByType = _groupByType(structureComponents);
        componentsByType[component.component.type!].push(component);

        const newComponents = _makeFlat(componentsByType);
        _handleAttributeComponent(component);
        setStructureComponents(newComponents);
        handleUpdate(newComponents);
      } else {
        setStructureComponents(components);
        handleUpdate(components);
      }
    },
    [handleUpdate, structureComponents],
  );

  // Declared as `any` because `StructureComponentsSelector` (already typed, out of scope here)
  // declares this callback as taking a `ComponentDefinition`, but its `removeClickHandler` in
  // fact always passes the string `data-component-id` dataset value at runtime.
  const handleRemove = useCallback(
    (id: any) => {
      const filteredComponentsByType = _groupByType(
        structureComponents.filter(({ component }) => component.identifiant !== id),
      );
      const filteredComponents = _makeFlat(filteredComponentsByType);
      setStructureComponents(filteredComponents);
      handleUpdate(filteredComponents);
    },
    [handleUpdate, structureComponents],
  );

  const saveSpecification = useCallback(
    (specification: any) => {
      const component = {
        ...selectedComponent,
        ...specification,
      };
      const components = structureComponents.map((c) => {
        if (c.order === component.order && c.component.type === component.component.type) {
          return component;
        }
        return c;
      });
      setStructureComponents(components);
      handleUpdate(components);
      setSelectedComponent({});
      setModalOpened(false);
    },
    [handleUpdate, structureComponents, selectedComponent],
  );

  const _handleAttributeComponent = (component: any) => {
    if (component.type === ATTRIBUTE_TYPE) {
      setSelectedComponent(component);
      setModalOpened(true);
    }
  };

  const _groupByType = (components: StructureComponent[]): ComponentsByType => {
    const componentsByType = components.reduce(
      (acc: ComponentsByType, structureComponent) => {
        const componentType = structureComponent.component.type!;
        return {
          ...acc,
          [componentType]: [...acc[componentType], structureComponent],
        };
      },
      {
        [ATTRIBUTE_PROPERTY_TYPE]: [],
        [DIMENSION_PROPERTY_TYPE]: [],
        [MEASURE_PROPERTY_TYPE]: [],
      } as ComponentsByType,
    );
    return componentsByType;
  };

  const _makeFlat = (componentsByType: ComponentsByType): StructureComponent[] => {
    const dimensions = componentsByType[DIMENSION_PROPERTY_TYPE];
    const measures = componentsByType[MEASURE_PROPERTY_TYPE];
    return [
      ...dimensions.map((component, index) => ({
        ...component,
        order: index + 1,
      })),
      ...measures.map((component, index) => ({
        ...component,
        order: dimensions.length + index + 1,
      })),
      ...componentsByType[ATTRIBUTE_PROPERTY_TYPE].map((component, index) => ({
        ...component,
        order: dimensions.length + measures.length + index + 1,
      })),
    ];
  };

  const addComponent = useCallback(
    (structureComponents: StructureComponent[], components: Component | Component[]) => {
      const componentsToAdd = Array.isArray(components) ? components : [components];
      const componentsByType = _groupByType(structureComponents);
      componentsToAdd.forEach((component, i) => {
        const newStructureComponent: StructureComponent = {
          component,
          order: componentsByType[component.type!].length + 1,
        };
        // If the main component added is an attribute, we add the Observation attachment
        if (component.type === ATTRIBUTE_PROPERTY_TYPE) {
          if (i === 0) {
            newStructureComponent.attachment = [OBSERVATION];
          } else {
            // Else this is a linked attribute to a measure
            newStructureComponent.attachment = [componentsToAdd[0].id!];
          }
        }
        componentsByType[component.type!].push(newStructureComponent);
      });
      const flatComponents = _makeFlat(componentsByType);
      setStructureComponents(flatComponents);
      handleUpdate(flatComponents);
      _handleAttributeComponent(componentsToAdd[0]);
    },
    [handleUpdate],
  );

  const handleAdd = useCallback(
    (id: string) => {
      const component = mutualizedComponents.find((c) => c.identifiant === id)!;
      if (component.type === MEASURE_PROPERTY_TYPE) {
        StructureApi.getMutualizedComponent(component.id).then((fullComponent: any) => {
          const componentsToAdd = [component];
          Object.keys(fullComponent)
            .filter((key) => key.startsWith("attribute_"))
            .forEach((iri) => {
              const attribute = mutualizedComponents.find((c) => c.iri === fullComponent[iri]);
              if (attribute) {
                componentsToAdd.push(attribute);
              }
            });
          addComponent(structureComponents, componentsToAdd);
        });
      } else {
        addComponent(structureComponents, component);
      }
    },
    [mutualizedComponents, structureComponents, addComponent],
  );

  const handleUp = useCallback(
    (id: any) => {
      const structureComponent = structureComponents.find((cs) => cs.component.identifiant === id)!;
      const componentByType = _groupByType(structureComponents);
      const componentArrayToUpdate = componentByType[structureComponent.component.type!];
      const index = Number(structureComponent.order) - 1;
      const startArray = componentArrayToUpdate.slice(0, index - 1);
      const endArray = componentArrayToUpdate.slice(index + 1);
      componentByType[structureComponent.component.type!] = [
        ...startArray,
        {
          ...componentArrayToUpdate[index],
          order: structureComponents[index - 1].order,
        },
        {
          ...componentArrayToUpdate[index - 1],
          order: structureComponents[index].order,
        },
        ...endArray,
      ];
      const components = _makeFlat(componentByType);
      setStructureComponents(components);
      handleUpdate(components);
    },
    [handleUpdate, structureComponents],
  );

  const handleDown = useCallback(
    (id: any) => {
      const structureComponent = structureComponents.find((cs) => cs.component.identifiant === id)!;
      const componentByType = _groupByType(structureComponents);
      const componentArrayToUpdate = componentByType[structureComponent.component.type!];
      const index = Number(structureComponent.order) - 1;
      const startArray = componentArrayToUpdate.slice(0, index);
      const endArray = componentArrayToUpdate.slice(index + 2);
      componentByType[structureComponent.component.type!] = [
        ...startArray,
        {
          ...structureComponents[index + 1],
          order: structureComponents[index].order,
        },
        {
          ...structureComponents[index],
          order: structureComponents[index + 1].order,
        },
        ...endArray,
      ];
      const components = _makeFlat(componentByType);
      setStructureComponents(components);
      handleUpdate(components);
    },
    [handleUpdate, structureComponents],
  );

  return (
    <>
      {modalOpened && (
        <ComponentSpecificationModal
          onClose={() => setModalOpened(false)}
          structureComponents={structureComponents}
          selectedComponent={selectedComponent}
          specification={{
            attachment: selectedComponent.attachment,
            required: selectedComponent.required,
            notation: selectedComponent.notation,
            labelLg1: selectedComponent.labelLg1,
            labelLg2: selectedComponent.labelLg2,
          }}
          onSave={saveSpecification}
        />
      )}
      <StructureComponentsSelector
        hidden={false}
        codelists={codelists}
        concepts={concepts}
        componentDefinitions={componentDefinitions.filter(filterComponentDefinition(type))}
        handleRemove={handleRemove}
        handleUp={handleUp}
        handleDown={handleDown}
        handleCreateOrUpdate={handleCreateOrUpdate}
        handleSpecificationClick={handleSpecificationClick}
        readOnly={false}
        type={type}
        handleCodelistDetail={handleCodelistDetail}
        structure={structure}
      />
      <MutualizedComponentsSelector
        concepts={concepts}
        codelists={codelists}
        hidden={true}
        components={filteredMutualizedComponents}
        handleAdd={handleAdd}
        readOnly={true}
        handleCodelistDetail={handleCodelistDetail}
      />
      <CodelistPanel
        codelist={codelistNotation}
        isOpen={!!codelistNotation}
        handleBack={() => setCodelistNotation(undefined)}
      />
    </>
  );
};
