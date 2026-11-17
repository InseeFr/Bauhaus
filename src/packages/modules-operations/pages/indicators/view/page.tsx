import { useCallback, useState } from "react";
import { useParams } from "react-router";

import { CheckSecondLang } from "@components/check-second-lang";
import { ErrorBloc, LoadingErrorBloc } from "@components/errors-bloc";
import { Loading, Publishing } from "@components/loading";
import { PageTitleBlock } from "@components/page-title-block";

import { OperationsApi } from "@sdk/operations-api";

import { useCodelist } from "@utils/hooks/codelist";
import { useSecondLang } from "@utils/hooks/second-lang";

import { CL_FREQ } from "../../../../constants/code-lists";
import { useIndicator, useInvalidateIndicators } from "../../../hooks/useIndicators";
import { OperationsIndicatorVisualization } from "./components/OperationsIndicatorVisualization";
import { Menu } from "./menu";

export const Component = () => {
  const { id } = useParams<{ id: string }>();

  const [secondLang] = useSecondLang();

  const frequencies = useCodelist(CL_FREQ);

  const { data: indicator, error: loadError } = useIndicator(id);

  const invalidateIndicators = useInvalidateIndicators();

  const [serverSideError, setServerSideError] = useState<string>();

  const [publishing, setPublishing] = useState(false);

  const frequency = frequencies?.codes.find((c) => c.code === indicator?.accrualPeriodicityCode);

  const publish = useCallback(() => {
    setPublishing(true);
    OperationsApi.publishIndicator(indicator)
      .then(() => invalidateIndicators())
      .catch((error: string) => setServerSideError(error))
      .finally(() => setPublishing(false));
  }, [indicator, invalidateIndicators]);

  if (loadError) return <LoadingErrorBloc error={loadError} />;

  if (!indicator) return <Loading />;

  if (publishing) return <Publishing />;

  return (
    <div className="container">
      <PageTitleBlock titleLg1={indicator.prefLabelLg1} titleLg2={indicator.prefLabelLg2} />
      <Menu indicator={indicator} publish={publish} />
      <ErrorBloc error={serverSideError} />
      <CheckSecondLang />
      <OperationsIndicatorVisualization
        secondLang={secondLang}
        attr={indicator}
        frequency={frequency}
      />
    </div>
  );
};
