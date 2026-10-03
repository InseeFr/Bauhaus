import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";

import { LoadingErrorBloc } from "@components/errors-bloc";
import { Loading } from "@components/loading";

import { Component as ComponentModel } from "@model/structures/Component";

import { ConceptsApi, StructureApi } from "@sdk/index";

import { useSecondLang } from "@utils/hooks/second-lang";
import { useGoBack } from "@utils/hooks/useGoBack";

import { ComponentDetailView } from "../../../components/ComponentDetailView";
import { ComponentTitle } from "../../../components/ComponentTitle";
import { useFormattedCodelist } from "../../../hooks/useFormattedCodelist";

export const Component = (props: any) => {
  const goBack = useGoBack();

  const [secondLang] = useSecondLang();

  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [component, setComponent] = useState<ComponentModel>({} as ComponentModel);

  const [concepts, setConcepts] = useState<any[]>([]);

  const { data: codelists = [] } = useFormattedCodelist();

  const [serverSideError, setServerSideError] = useState<unknown>();

  const [loadError, setLoadError] = useState<unknown>();

  const [attributes, setAttributes] = useState<ComponentModel[]>([]);

  const handleBack = useCallback(() => goBack("/structures/components"), [goBack]);

  const handleDelete = useCallback(() => {
    setLoading(true);
    StructureApi.deleteMutualizedComponent(id)
      .then(() => goBack("/structures/components"))
      .catch((error: unknown) => {
        setServerSideError(error);
        setLoading(false);
      });
  }, [id, goBack]);

  useEffect(() => {
    Promise.all([
      StructureApi.getMutualizedComponent(id),
      StructureApi.getMutualizedAttributes(),
      ConceptsApi.getConceptList(),
    ])
      .then(([component, attributes, concepts]: [ComponentModel, ComponentModel[], any[]]) => {
        setComponent({
          ...component,
        });
        setAttributes(attributes);
        setConcepts(concepts);
      })
      .catch(setLoadError)
      .finally(() => setLoading(false));
  }, [id]);

  if (loadError) {
    return <LoadingErrorBloc error={loadError} />;
  }

  if (loading) {
    return <Loading />;
  }

  const publishComponent = () => {
    setLoading(true);
    return StructureApi.publishMutualizedComponent(component)
      .then(() => StructureApi.getMutualizedComponent(component.id))
      .then((component: ComponentModel) => setComponent(component))
      .finally(() => setLoading(false))
      .catch(setServerSideError);
  };

  return (
    <>
      <ComponentTitle component={component} />
      <ComponentDetailView
        {...props}
        col={2}
        codelists={codelists}
        component={component}
        concepts={concepts}
        handleBack={handleBack}
        handleDelete={handleDelete}
        handleUpdate={`/structures/components/${component.id}/modify`}
        mutualized={true}
        updatable={true}
        publishComponent={publishComponent}
        serverSideError={serverSideError}
        secondLang={secondLang}
        attributes={attributes}
      />
    </>
  );
};
