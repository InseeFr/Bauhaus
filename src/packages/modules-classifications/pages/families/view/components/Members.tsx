import { ClassificationMembers } from "../../../../components/ClassificationMembers";
import { D1, D2 } from "../../../../../deprecated-locales";

interface FamilyMember {
  id: string;
  labelLg1: string;
  labelLg2?: string;
  [key: string]: unknown;
}

type Props = Readonly<{
  members: FamilyMember[];
  secondLang: boolean;
}>;

export const Members = ({ members, secondLang }: Props) => (
  <ClassificationMembers
    members={members}
    secondLang={secondLang}
    linkBasePath="/classifications/series"
    titleD1={D1.childrenSeries}
    titleD2={D2.childrenSeries}
  />
);
