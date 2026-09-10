import { ClassificationMembers } from "../../../../components/ClassificationMembers";
import { classificationsI18n } from "../../../../i18n";

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
    titleD1={classificationsI18n.t("family.childrenSeries", { lng: "fr" })}
    titleD2={classificationsI18n.t("family.childrenSeries", { lng: "en" })}
  />
);
