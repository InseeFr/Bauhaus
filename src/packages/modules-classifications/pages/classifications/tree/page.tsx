import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

  const { id } = useParams<{ id: string }>();

  const [general, setGeneral] = useState<ClassificationGeneral>();

  const { isLoading, data: flatTree } = useClassificationsItem(id);

  useEffect(() => {
    ClassificationsApi.getClassificationGeneral(id).then((response) => setGeneral(response));
  }, [id]);

  if (isLoading || !general) return <Loading />;

  const { prefLabelLg1, prefLabelLg2 } = general;

  return (
    <ClassificationTree
      prefLabel={secondLang ? prefLabelLg2 : prefLabelLg1}
      data={flatTree}
      secondLang={secondLang}
    />
  );
};
