import { QueryClient, useQueryClient, useSuspenseQueries } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { LoaderFunctionArgs, useParams } from "react-router";

import { Loading } from "@components/loading";

import { StructureApi } from "@sdk/index";

import { conceptListQuery } from "@utils/hooks/concepts";
import { useSecondLang } from "@utils/hooks/second-lang";
import { useGoBack } from "@utils/hooks/useGoBack";

import { appQueryClient } from "../../../../application/query-client";
import { ComponentDetailView } from "../../../components/ComponentDetailView";
import { ComponentTitle } from "../../../components/ComponentTitle";
import { mutualizedAttributesQuery, mutualizedComponentQuery } from "../../../hooks/queries";
import { useFormattedCodelist } from "../../../hooks/useFormattedCodelist";

/** Lance la lecture de la composante pendant le téléchargement de la page, sans retenir la navigation. */
export const prefetchMutualizedComponent =
  (queryClient: QueryClient) =>
  ({ params }: LoaderFunctionArgs) => {
    void queryClient.prefetchQuery(mutualizedComponentQuery(params.id!));
    void queryClient.prefetchQuery(mutualizedAttributesQuery());
    void queryClient.prefetchQuery(conceptListQuery());
    return null;
  };

export const loader = prefetchMutualizedComponent(appQueryClient);

export const Component = (props: any) => {
  const goBack = useGoBack();

  const [secondLang] = useSecondLang();

  const { id } = useParams<{ id: string }>();

  const queryClient = useQueryClient();

  const [{ data: component }, { data: attributes }, { data: concepts }] = useSuspenseQueries({
    queries: [mutualizedComponentQuery(id!), mutualizedAttributesQuery(), conceptListQuery()],
  });

  const [loading, setLoading] = useState(false);

  const { data: codelists = [] } = useFormattedCodelist();

  const [serverSideError, setServerSideError] = useState<unknown>();

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

  if (loading) {
    return <Loading />;
  }

  const publishComponent = () => {
    setLoading(true);
    return StructureApi.publishMutualizedComponent(component)
      .then(() =>
        queryClient.invalidateQueries({ queryKey: mutualizedComponentQuery(id!).queryKey }),
      )
      .catch(setServerSideError)
      .finally(() => setLoading(false));
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
