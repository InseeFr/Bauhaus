import { useTranslation } from "react-i18next";

import { CheckSecondLang } from "@components/check-second-lang";
import { ExplanatoryNote } from "@components/explanatory-note";
import { Row } from "@components/layout";
import { Note } from "@components/note";
import { PageTitle } from "@components/page-title";

import { buildAssociationItemLinks } from "../../../../utils/buildAssociationItemLinks";
import { CorrespondenceControls } from "./CorrespondenceControls";

export const AssociationHome = ({
  association,
  secondLang,
}: {
  association: any;
  secondLang: boolean;
}) => {
  const { t } = useTranslation();

  const {
    labelLg1,
    labelLg2,
    correspondenceId,
    associationId,
    scopeNoteLg1,
    scopeNoteLg2,
    sourceItemLabelLg2,
    targetItemLabelLg2,
  } = association;

  const title = secondLang ? labelLg2 : labelLg1;

  return (
    <div className="container">
      <PageTitle title={title} subtitle={associationId} />
      <CorrespondenceControls correspondenceId={correspondenceId} />
      <CheckSecondLang />
      <Row>
        {(!secondLang || (secondLang && sourceItemLabelLg2 && targetItemLabelLg2)) && (
          <Note
            text={buildAssociationItemLinks(association, secondLang)}
            title={t("correspondence.globalInformation")}
            alone={true}
            allowEmpty={true}
          />
        )}
      </Row>
      <span>
        {scopeNoteLg1 && (
          <Row>
            <ExplanatoryNote
              text={scopeNoteLg1}
              title={t("correspondence.description", { lng: "fr" })}
              alone={!secondLang}
            />
            {secondLang && (
              <ExplanatoryNote
                text={scopeNoteLg2}
                title={t("correspondence.description", { lng: "en" })}
                alone={false}
              />
            )}
          </Row>
        )}
      </span>
    </div>
  );
};
