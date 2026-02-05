import { Organization } from "@model/organization";

import { Organisation } from "../organisations/organisations";
import D from "../../../deprecated-locales";

interface Props {
  creator: string;
  organizations: Organization[];
}

export const CreatorsVisualisation = ({ creator, organizations }: Props) => {
  return (
    <>
      {D.creatorTitle} : <Organisation creator={creator} organizations={organizations} />
    </>
  );
};
