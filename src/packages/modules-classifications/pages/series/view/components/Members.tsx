import { ClassificationMembers } from "../../../../components/ClassificationMembers";
import { D1, D2 } from "../../../../../deprecated-locales";

interface SeriesMember {
  id: string;
  labelLg1: string;
  labelLg2?: string;
  [key: string]: unknown;
}

type Props = Readonly<{
  members: SeriesMember[];
  secondLang: boolean;
}>;

const Members = ({ members, secondLang }: Props) => (
  <ClassificationMembers
    members={members}
    secondLang={secondLang}
    linkBasePath="/classifications/classification"
    titleD1={D1.childrenClassifications}
    titleD2={D2.childrenClassifications}
  />
);

export default Members;
