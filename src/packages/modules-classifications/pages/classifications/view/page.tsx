import { useParams } from "react-router-dom";

import { Loading, Publishing } from "@components/loading";

import { useSecondLang } from "@utils/hooks/second-lang";

import { useClassification } from "../../../hooks/useClassification";
import { usePublishClassification } from "../../../hooks/usePublishClassification";
import { ClassificationVisualization } from "./components/ClassificationVisualization";

export const Component = () => {
  const { id = "" } = useParams<{ id: string }>();

  const [secondLang] = useSecondLang();

  const { isLoading, classification } = useClassification(id);

  const { isPublishing, publish, error } = usePublishClassification(id);

  if (isLoading) {
    return <Loading />;
  }

  if (isPublishing) return <Publishing />;

  if (!classification) return <Loading />;

  return (
    <ClassificationVisualization
      classification={classification}
      classificationId={id}
      secondLang={secondLang}
      publish={publish}
      serverSideError={error}
    />
  );
};
