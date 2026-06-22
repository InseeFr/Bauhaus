import { ClassificationMembers } from "../../components/ClassificationMembers";
import { D1, D2 } from "../../../deprecated-locales";

const Members = ({ members, secondLang }) => (
  <ClassificationMembers
    members={members}
    secondLang={secondLang}
    linkBasePath="/classifications/classification"
    titleD1={D1.childrenClassifications}
    titleD2={D2.childrenClassifications}
  />
);

export default Members;
