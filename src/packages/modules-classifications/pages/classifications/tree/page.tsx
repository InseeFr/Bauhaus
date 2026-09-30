import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { LoadingErrorBloc } from "@components/errors-bloc";
import { Loading } from "@components/loading";

import { ClassificationsApi } from "@sdk/classification";

import { useClassificationsItem } from "@utils/hooks/classifications";
import { useSecondLang } from "@utils/hooks/second-lang";

import { ClassificationTree } from "./components/ClassificationTree";

interface ClassificationGeneral {
  prefLabelLg1: string;
  prefLabelLg2?: string;
  [key: string]: unknown;
}

export const Component = () => {
  const [secondLang] = useSecondLang();

  const { id = "" } = useParams<{ id: string }>();

  const [general, setGeneral] = useState<ClassificationGeneral>();

  const [loadError, setLoadError] = useState<unknown>();

  const { isLoading, data: flatTree, error: treeError } = useClassificationsItem(id);

  useEffect(() => {
    ClassificationsApi.getClassificationGeneral(id)
      .then((response: ClassificationGeneral) => setGeneral(response))
      .catch(setLoadError);
  }, [id]);

  if (loadError || (treeError && !flatTree))
    return <LoadingErrorBloc error={loadError ?? treeError} />;

  if (isLoading || !general) return <Loading />;

  const { prefLabelLg1, prefLabelLg2 } = general;

  return (
    <ClassificationTree
      prefLabel={(secondLang ? prefLabelLg2 : prefLabelLg1) ?? ""}
      data={flatTree}
      secondLang={secondLang}
    />
  );
};
