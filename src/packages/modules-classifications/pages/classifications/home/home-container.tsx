import { Loading } from "@components/loading";

import ClassificationsHome from "./home";
import { useClassifications } from "../../../hooks/useClassifications";

export const Component = () => {
  const { isLoading, data: classifications } = useClassifications();

  if (isLoading) return <Loading />;
  return <ClassificationsHome classifications={classifications!} />;
};
