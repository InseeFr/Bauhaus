import { useParams } from "react-router-dom";

import { Loading } from "@components/loading";

import { useSecondLang } from "@utils/hooks/second-lang";

import useClassificationItem from "../hook";
import Compare from "./home";

export const Component = () => {
  const { classificationId, itemId } = useParams();

  const [secondLang] = useSecondLang();

  const { isLoading, item } = useClassificationItem(classificationId, itemId);

  if (isLoading) return <Loading />;

  return (
    <Compare
      classificationId={classificationId}
      itemId={itemId}
      general={item!.general}
      notes={item!.notes}
      secondLang={secondLang}
    />
  );
};
