import { useCallback, useState } from "react";

import { Component as ComponentModel } from "@model/structures/Component";

import { useSecondLang } from "@utils/hooks/second-lang";

import { ComponentDetailEdit, ComponentFormState } from "./ComponentDetailEdit";
import { ComponentDetailView } from "./ComponentDetailView";
import { ComponentTitle } from "./ComponentTitle";

interface ComponentDetailTypes {
  component?: Partial<ComponentModel>;
  // Callers disagree on the shape they hand back: `StructureComponentsSelector` expects a
  // `ComponentDefinition`, `MutualizedComponentsSelector` passes a no-op, and the value actually
  // produced here (from `ComponentDetailEdit`'s form state) is a `Component`-shaped object.
  handleSave: (component: any) => void;
  handleBack: VoidFunction;
  readOnly?: boolean;
  codelists?: any;
  concepts?: any;
  structureComponents?: any[];
  type?: string;
  stampListOptions?: any;
  mutualized?: boolean;
}

export const ComponentDetail = (props: Readonly<ComponentDetailTypes>) => {
  const [secondLang] = useSecondLang();

  const [mode, setMode] = useState(!props.component?.labelLg1 ? "EDIT" : "VIEW");

  const handleViewUpdate = useCallback(() => setMode("EDIT"), []);

  const handleEditUpdate = useCallback(
    (component: ComponentFormState) => {
      props.handleSave(component);
      setMode("VIEW");
    },
    [props],
  );

  const handleEditBack = useCallback(
    () => (!props.component?.labelLg1 ? props.handleBack() : setMode("VIEW")),
    [props],
  );

  // A component being created has no `contributor`/`structures` yet, so `ComponentDetail` only
  // ever holds a `Partial<Component>`; the view-only children below always render once the
  // component is fully loaded (mode only switches to "VIEW" once `labelLg1` is set).
  const component = props.component as ComponentModel;

  return (
    <div className="container">
      {mode === "VIEW" && (
        <>
          <ComponentTitle component={component} />
          <ComponentDetailView
            {...props}
            component={component}
            secondLang={secondLang}
            handleUpdate={handleViewUpdate}
            handleBack={props.handleBack}
            updatable={!props.readOnly}
          />
        </>
      )}
      {mode === "EDIT" && (
        <ComponentDetailEdit {...props} handleSave={handleEditUpdate} handleBack={handleEditBack} />
      )}
    </div>
  );
};
