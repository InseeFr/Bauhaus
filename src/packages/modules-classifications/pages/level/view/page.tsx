import { useParams } from "react-router-dom";

import { Loading } from "@components/loading";

import { useSecondLang } from "@utils/hooks/second-lang";

import { useClassificationLevel } from "../../../hooks/useClassificationLevel";
import { LevelVisualization } from "./components/LevelVisualization";

export const Component = () => {
  const { classificationId = "", levelId = "" } = useParams<{
    classificationId: string;
    levelId: string;
  }>();

  const { isLoading, level } = useClassificationLevel(classificationId, levelId);

  const [secondLang] = useSecondLang();

  if (isLoading || !level) return <Loading />;

  return <LevelVisualization level={level} secondLang={secondLang} />;
};
