import { useTitle } from "@utils/hooks/useTitle";

import D from "../../../../deprecated-locales";
import { EditionForm } from "../edit/components/EditionForm";

export const Component = () => {
  useTitle(D.structuresTitle, D.structuresCreateTitle);
  return <EditionForm creation={true} />;
};
