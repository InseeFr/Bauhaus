import { useParams } from "react-router-dom";

import { Loading } from "@components/loading";

import { useClassificationLevel } from "../hooks/useClassificationLevel";
import { useSecondLang } from "../../utils/hooks/second-lang";
import LevelVisualization from "./home";

export const Component = () => {
  const { classificationId, levelId } = useParams();
  const { isLoading, level } = useClassificationLevel(classificationId, levelId);
  const [secondLang] = useSecondLang();

  if (isLoading || !level) return <Loading />;
  return <LevelVisualization level={level} secondLang={secondLang} />;
};
