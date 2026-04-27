import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

import { Loading, Saving } from "@components/loading";

import { ConceptsApi, saveComponent, StructureApi } from "@sdk/index";

import { useGoBack } from "@utils/hooks/useGoBack";

import { Component as StructureComponent } from "../../../../model/structures/Component";
import { useFormattedCodeList } from "../../../hooks/useFormattedCodeList";
import { ComponentDetailEdit } from "../../../components/ComponentDetailEdit";

export const Component = (props: any) => {
  const goBack = useGoBack();

  const { id } = useParams<{ id: string }>();

  const urlParams = new URLSearchParams(window.location.search);

  const type = urlParams.get("type");

  const [loading, setLoading] = useState<boolean>(true);

  const [saving, setSaving] = useState<boolean>(false);

  const [component, setComponent] = useState({});

  const [concepts, setConcepts] = useState([]);

  const { data: codesLists = [] } = useFormattedCodeList();

  const [serverSideError, setServerSideError] = useState<string>("");

  const [attributes, setAttributes] = useState([]);

  const handleBack = useCallback(() => goBack("/structures/components"), [goBack]);

  const handleSave = useCallback(
    (component: StructureComponent) => {
      setSaving(true);
      setServerSideError("");
      saveComponent(component)
        .then((id = component.id) => goBack(`/structures/components/${id}`, !component.id))
        .catch((error: string) => {
          setComponent(component);
          setServerSideError(error);
        })
        .finally(() => setSaving(false));
    },
    [goBack],
  );

  useEffect(() => {
    const getComponent = id ? StructureApi.getMutualizedComponent(id) : Promise.resolve({});
    Promise.all([
      getComponent,
      StructureApi.getMutualizedAttributes(),
      ConceptsApi.getConceptList(),
    ])
      .then(([component, attributes, concepts]) => {
        setComponent(component);
        setAttributes(attributes);
        setConcepts(concepts);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;

  if (saving) return <Saving />;

  return (
    <ComponentDetailEdit
      {...props}
      col={2}
      codesLists={codesLists}
      component={component}
      concepts={concepts}
      handleBack={handleBack}
      handleSave={handleSave}
      mutualized={true}
      attributes={attributes}
      serverSideError={serverSideError}
      type={type === "ALL" ? undefined : type}
    />
  );
};
