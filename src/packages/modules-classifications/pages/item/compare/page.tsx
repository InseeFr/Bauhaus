import { useParams } from "react-router-dom";

import { LoadingErrorBloc } from "@components/errors-bloc";
import { Loading } from "@components/loading";

import { useSecondLang } from "@utils/hooks/second-lang";

import { useClassificationItem } from "../../../hooks/useClassificationItem";
import { Compare } from "./components/Compare";

export const Component = () => {
  const { classificationId = "", itemId = "" } = useParams<{
    classificationId: string;
    itemId: string;
  }>();

  const [secondLang] = useSecondLang();

  const { isLoading, item, error } = useClassificationItem(classificationId, itemId);

  if (error && !item) return <LoadingErrorBloc error={error} />;

  if (isLoading) return <Loading />;

  return (
    <Compare
      classificationId={classificationId}
      general={item!.general}
      notes={item!.notes}
      secondLang={secondLang}
    />
  );
};
