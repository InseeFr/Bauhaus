import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Loading } from "@components/loading";

import { ClassificationsApi } from "@sdk/classification";

import { useSecondLang } from "@utils/hooks/second-lang";

import { FamilyVisualization } from "./components/FamilyVisualization";

interface FamilyGeneral {
  prefLabelLg1: string;
  [key: string]: unknown;
}

interface FamilyMember {
  id: string;
  labelLg1: string;
  labelLg2?: string;
  [key: string]: unknown;
}

export const Component = () => {
  const { id } = useParams<{ id: string }>();

  const [secondLang] = useSecondLang();

  const [family, setFamily] = useState<{
    general: FamilyGeneral;
    members: FamilyMember[];
  }>();

  useEffect(() => {
    Promise.all([
      ClassificationsApi.getFamilyGeneral(id),
      ClassificationsApi.getFamilyMembers(id),
    ]).then(([general, members]) => {
      setFamily({
        general: general ?? {},
        members: members ?? [],
      });
    });
  }, [id]);

  if (!family) return <Loading />;

  return <FamilyVisualization family={family} secondLang={secondLang} />;
};
