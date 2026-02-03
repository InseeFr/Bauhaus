import { useParams } from "react-router-dom";

import { CheckSecondLang } from "@components/check-second-lang";
import { ErrorBloc } from "@components/errors-bloc";
import { Deleting, Loading, Publishing } from "@components/loading";
import { PageTitleBlock } from "@components/page-title-block";

import { useTitle } from "@utils/hooks/useTitle";

import D from "../../../deprecated-locales/build-dictionary";

import { ViewMenu } from "./menu";
import { ViewMainBlock } from "./view-main-block";
import { useDistribution } from "../../hooks/useDistribution";
import { useDataset } from "../../hooks/useDataset";
import { useDatasetPublisher } from "../../hooks/useDatasetPublisher";
import { useDatasetDeleter } from "../../hooks/useDatasetDeleter";

export const Component = () => {
  const { id } = useParams<{ id: string }>();

  const { data: distribution, isLoading } = useDistribution(id!);

  const { data: dataset, isLoading: isLoadingDataSet } = useDataset(
    distribution?.idDataset,
  );

  const { isPublishing, publish, validationServerSideError } =
    useDatasetPublisher(id!);

  const { isDeleting, remove, deleteServerSideError } = useDatasetDeleter(id!);

  useTitle(D.distributionsTitle, distribution?.labelLg1);

  if (isLoading || isLoadingDataSet) return <Loading />;
  if (isDeleting) return <Deleting />;
  if (isPublishing) return <Publishing />;

  return (
    <div className="container">
      <PageTitleBlock
        titleLg1={distribution.labelLg1}
        titleLg2={distribution.labelLg2}
      />

      <ViewMenu
        distribution={distribution}
        dataset={dataset}
        onPublish={publish}
        onDelete={remove}
      />

      <ErrorBloc
        error={validationServerSideError || deleteServerSideError}
        D={D}
      />

      <CheckSecondLang />

      <ViewMainBlock distribution={distribution} />
    </div>
  );
};
