import { Organization } from "@model/organization";

import { Organisations } from "../organisations/organisations";
import D from "../../../deprecated-locales";

interface Props {
  creators: string[];
  organizations: Organization[];
}

export const ContributorsVisualisation = ({ creators, organizations }: Props) => {
  return (
    <>
      {D.contributorTitle} : <Organisations creators={creators} organizations={organizations} />
    </>
  );
};
