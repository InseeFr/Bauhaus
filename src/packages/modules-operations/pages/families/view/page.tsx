import { useCallback, useState } from "react";
import { useParams } from "react-router";

import { CheckSecondLang } from "@components/check-second-lang";
import { ErrorBloc, LoadingErrorBloc } from "@components/errors-bloc";
import { Loading, Publishing } from "@components/loading";
import { PageTitleBlock } from "@components/page-title-block";

import { OperationsApi } from "@sdk/operations-api";

import { useSecondLang } from "@utils/hooks/second-lang";

import { useFamily, useInvalidateFamilies } from "../../../hooks/useFamilies";
import { OperationsFamilyVisualization } from "./components/OperationsFamilyVisualization";
import { Menu } from "./menu";

export const Component = () => {
  const { id } = useParams<{ id: string }>();

  const [secondLang] = useSecondLang();

  const { data: family, error: loadError } = useFamily(id);

  const invalidateFamilies = useInvalidateFamilies();

  const [serverSideError, setServerSideError] = useState();

  const [publishing, setPublishing] = useState(false);

  const publish = useCallback(() => {
    setPublishing(true);
    OperationsApi.publishFamily(family)
      .then(() => invalidateFamilies())
      .catch((error: any) => setServerSideError(error))
      .finally(() => setPublishing(false));
  }, [family, invalidateFamilies]);

  if (loadError) return <LoadingErrorBloc error={loadError} />;

  if (!family) return <Loading />;

  if (publishing) return <Publishing />;

  return (
    <div className="container">
      <PageTitleBlock titleLg1={family.prefLabelLg1} titleLg2={family.prefLabelLg2} />
      <Menu family={family} publish={publish} />
      <ErrorBloc error={serverSideError} />
      <CheckSecondLang />
      <OperationsFamilyVisualization secondLang={secondLang} attr={family} />
    </div>
  );
};
