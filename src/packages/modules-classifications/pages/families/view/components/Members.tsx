import i18next from "../../../../i18n";

import { ClassificationMembers } from "../../../../components/ClassificationMembers";

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
    titleD1={i18next.t("family.childrenSeries", { lng: "fr" })}
    titleD2={i18next.t("family.childrenSeries", { lng: "en" })}
  />
);
