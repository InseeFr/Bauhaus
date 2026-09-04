import { Loading } from "@components/loading";

import { useClassifications } from "../../../hooks/useClassifications";
import { ClassificationsHome } from "./components/ClassificationsHome";

export const Component = () => {
  const { isLoading, data: classifications } = useClassifications();

  if (isLoading) return <Loading />;

  return <ClassificationsHome classifications={classifications!} />;
};
