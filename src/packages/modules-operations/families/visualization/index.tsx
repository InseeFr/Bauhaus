import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { CheckSecondLang } from "@components/check-second-lang";
import { ErrorBloc } from "@components/errors-bloc";
import { Loading, Publishing } from "@components/loading";
import { PageTitleBlock } from "@components/page-title-block";

import { OperationsApi } from "@sdk/operations-api";

import { useSecondLang } from "@utils/hooks/second-lang";

import D from "../../../deprecated-locales";
import { Family } from "../../../model/operations/family";
import { Menu } from "./menu";
import OperationsFamilyVisualization from "./visualization";

export const Component = () => {
  const { id } = useParams<{ id: string }>();
  const [secondLang] = useSecondLang();

  const [family, setFamily] = useState<Family>();
  const [serverSideError, setServerSideError] = useState();
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    OperationsApi.getFamilyById(id).then(setFamily);
  }, [id]);

  const publish = useCallback(() => {
    setPublishing(true);

    OperationsApi.publishFamily(family)
      .then(() => {
        return OperationsApi.getFamilyById(id).then(setFamily);
      })
      .catch((error: any) => setServerSideError(error))
      .finally(() => setPublishing(false));
  }, [family, id]);

  if (!family) return <Loading />;
  if (publishing) return <Publishing />;

  return (
    <div className="container">
      <PageTitleBlock titleLg1={family.prefLabelLg1} titleLg2={family.prefLabelLg2} />
      <Menu family={family} publish={publish} />
      <ErrorBloc error={serverSideError} D={D} />

      <CheckSecondLang />
      <OperationsFamilyVisualization secondLang={secondLang} attr={family} />
    </div>
  );
};
