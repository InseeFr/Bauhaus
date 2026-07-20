import { useEffect, useState } from "react";

import { Loading } from "@components/loading";

import { ClassificationsApi } from "@sdk/classification";

import FamiliesHome from "./home";

interface Family {
  id: string;
  label: string;
  [key: string]: unknown;
}

export const Component = () => {
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ClassificationsApi.getFamiliesList()
      .then((result) => setFamilies(result))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

  return <FamiliesHome families={families} />;
};
