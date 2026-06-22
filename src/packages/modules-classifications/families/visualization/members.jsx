import { ClassificationMembers } from "../../components/ClassificationMembers";
import { D1, D2 } from "../../../deprecated-locales";

const Members = ({ members, secondLang }) => (
  <ClassificationMembers
    members={members}
    secondLang={secondLang}
    linkBasePath="/classifications/series"
    titleD1={D1.childrenSeries}
    titleD2={D2.childrenSeries}
  />
);

export default Members;
