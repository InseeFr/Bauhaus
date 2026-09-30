import { useParams } from "react-router-dom";

import { LoadingErrorBloc } from "@components/errors-bloc";
import { Loading } from "@components/loading";

import { useSecondLang } from "@utils/hooks/second-lang";

import { useClassificationLevel } from "../../../hooks/useClassificationLevel";
import { LevelVisualization } from "./components/LevelVisualization";

export const Component = () => {
  const { classificationId = "", levelId = "" } = useParams<{
    classificationId: string;
    levelId: string;
  }>();

  const { isLoading, level, error } = useClassificationLevel(classificationId, levelId);

  const [secondLang] = useSecondLang();

  if (error && !level) return <LoadingErrorBloc error={error} />;

  if (isLoading || !level) return <Loading />;

  return <LevelVisualization level={level} secondLang={secondLang} />;
};
