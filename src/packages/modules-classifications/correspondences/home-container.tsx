import { useEffect, useState } from "react";

import { Loading } from "@components/loading";

import { ClassificationsApi } from "@sdk/classification";

import CorrespondencesHome from "./home";

export const Component = () => {
  const [correspondences, setCorrespondences] = useState();

  useEffect(() => {
    ClassificationsApi.getCorrespondencesList().then(setCorrespondences);
  }, []);

  if (!correspondences) return <Loading />;
  return <CorrespondencesHome correspondences={correspondences} />;
};
