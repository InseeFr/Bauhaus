import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { Loading } from "@components/loading";

import { useSecondLang } from "@utils/hooks/second-lang";

import { useClassificationItem } from "../../../hooks/useClassificationItem";
import { fetchingPreviousLevels } from "../../../hooks/useClassificationItemClient";
import { ItemVisualization } from "./components/ItemVisualization";

export const Component = () => {
  const queryClient = useQueryClient();

  const { classificationId, itemId } = useParams<{
    classificationId: string;
    itemId: string;
  }>();

  const [secondLang] = useSecondLang();

  const { isLoading, item } = useClassificationItem(classificationId, itemId, true);

  if (isLoading || !item.general) return <Loading />;

  queryClient.prefetchQuery({
    queryKey: ["classification-parent-levels", classificationId, itemId],
    queryFn: () => {
      return fetchingPreviousLevels(classificationId, item.general);
    },
  });

  return <ItemVisualization item={item} secondLang={secondLang} />;
};
