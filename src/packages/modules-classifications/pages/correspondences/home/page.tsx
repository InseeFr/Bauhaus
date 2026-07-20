import { useEffect, useState } from "react";

import { Loading } from "@components/loading";

import { ClassificationsApi } from "@sdk/classification";

import CorrespondencesHome from "./home";

interface Correspondence {
  id: string;
  label: string;
  [key: string]: unknown;
}

export const Component = () => {
  const [correspondences, setCorrespondences] = useState<Correspondence[]>();

  useEffect(() => {
    ClassificationsApi.getCorrespondencesList().then(setCorrespondences);
  }, []);

  if (!correspondences) return <Loading />;
  return <CorrespondencesHome correspondences={correspondences} />;
};
