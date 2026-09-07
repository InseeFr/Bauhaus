import { Loading } from "@components/loading";

import { ClassificationsHome } from "./components/ClassificationsHome";
import { useClassifications } from "../../../hooks/useClassifications";

export const Component = () => {
  const { isLoading, data: classifications } = useClassifications();

  if (isLoading) return <Loading />;

  return <ClassificationsHome classifications={classifications!} />;
};
