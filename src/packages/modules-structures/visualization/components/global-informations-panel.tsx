import { CreationUpdateItems } from "@components/creation-update-items";
import { DisseminationStatusVisualisation } from "@components/dissemination-status/disseminationStatus";
import { Row } from "@components/layout";
import { Note } from "@components/note";
import { PublicationFemale } from "@components/status";

import { D1 } from "../../../deprecated-locales";
import { Structure } from "../../../model/structures/Structure";
import D from "../../i18n/build-dictionary";

import {
  InseeOrganisation,
  InseeOrganisations,
} from "@components/business/organisations/organisations";

interface GlobalInformationsPanelTypes {
  structure: Structure;
}

export const GlobalInformationsPanel = ({ structure }: GlobalInformationsPanelTypes) => {
  const creators = Array.isArray(structure.contributor)
    ? structure.contributor
    : [structure.contributor];
  return (
    <Row>
      <Note
        text={
          <ul>
            <li>
              {D1.idTitle} : {structure.identifiant}
            </li>
            <CreationUpdateItems creation={structure.created} update={structure.modified} />
            <li>
              {D.componentValididationStatusTitle} : <PublicationFemale object={structure} />
            </li>
            <li>
              {D.creator} : <InseeOrganisation creator={structure.creator} />
            </li>
            <li>
              {D.contributor} : <InseeOrganisations creators={creators} />
            </li>
            <li>
              <DisseminationStatusVisualisation
                disseminationStatus={structure.disseminationStatus}
              />
            </li>
          </ul>
        }
        title={D1.globalInformationsTitle}
        alone={true}
      />
    </Row>
  );
};
