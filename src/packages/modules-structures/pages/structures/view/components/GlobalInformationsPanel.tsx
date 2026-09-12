import { useTranslation } from "react-i18next";

import {
  InseeOrganization,
  InseeOrganizations,
} from "@components/business/organizations/organizations";
import { CreationUpdateItems } from "@components/creation-update-items";
import { DisseminationStatusVisualization } from "@components/dissemination-status/disseminationStatus";
import { Row } from "@components/layout";
import { Note } from "@components/note";
import { PublicationStatusItem } from "@components/status/PublicationStatusItem";

import { Structure } from "@model/structures/Structure";

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
              {t("structure.creator")} : <InseeOrganization creator={structure.creator} />
            </li>
            <li>
              {t("structure.contributors")} : <InseeOrganizations creators={creators} />
            </li>
            <li>
              <DisseminationStatusVisualization
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
