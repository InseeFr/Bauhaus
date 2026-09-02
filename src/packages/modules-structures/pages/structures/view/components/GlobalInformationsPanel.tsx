import { useTranslation } from "react-i18next";

import { CreationUpdateItems } from "@components/creation-update-items";
import { DisseminationStatusVisualisation } from "@components/dissemination-status/disseminationStatus";
import { Row } from "@components/layout";
import { Note } from "@components/note";
import { PublicationStatusItem } from "@components/status/PublicationStatusItem";
import {
  InseeOrganisation,
  InseeOrganisations,
} from "@components/business/organisations/organisations";

import { Structure } from "../../../../../model/structures/Structure";

interface GlobalInformationsPanelTypes {
  structure: Structure;
}

export const GlobalInformationsPanel = ({ structure }: GlobalInformationsPanelTypes) => {
  const { t } = useTranslation();

  const creators = Array.isArray(structure.contributor)
    ? structure.contributor
    : [structure.contributor];

  return (
    <Row>
      <Note
        text={
          <ul>
            <li>
              {t("structure.notation")} : {structure.identifiant}
            </li>
            <CreationUpdateItems creation={structure.created} update={structure.modified} />
            <PublicationStatusItem
              label={t("structure.validationStatus")}
              object={structure}
              gender="female"
            />
            <li>
              {t("structure.creator")} : <InseeOrganisation creator={structure.creator} />
            </li>
            <li>
              {t("structure.contributors")} : <InseeOrganisations creators={creators} />
            </li>
            <li>
              <DisseminationStatusVisualisation
                disseminationStatus={structure.disseminationStatus}
              />
            </li>
          </ul>
        }
        title={t("structure.globalInformation")}
        alone={true}
      />
    </Row>
  );
};
