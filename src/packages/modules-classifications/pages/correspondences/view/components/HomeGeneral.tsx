import { useTranslation } from "react-i18next";

import { CheckSecondLang } from "@components/check-second-lang";
import { ExplanatoryNote } from "@components/explanatory-note";
import { Row } from "@components/layout";
import { Note } from "@components/note";
import { PageTitle } from "@components/page-title";

import { useTitle } from "@utils/hooks/useTitle";

import { buildCorrespondenceClassificationLinks } from "../../../../utils/buildCorrespondenceClassificationLinks";
import { CorrespondenceControls } from "./CorrespondenceControls";

export const HomeGeneral = ({
  correspondence,
  secondLang,
}: {
  correspondence: any;
  secondLang: boolean;
}) => {
  const { t } = useTranslation();

  const { labelLg1, labelLg2, firstClassLabelLg2, secondClassLabelLg2 } = correspondence;

  const title = secondLang ? labelLg2 : labelLg1;

  useTitle(t("correspondence.pluralTitle"), labelLg1);

  return (
    <div>
      {title && <PageTitle title={title} />}
      <CorrespondenceControls />
      <CheckSecondLang />
      <Row>
        {(!secondLang || (secondLang && (firstClassLabelLg2 || secondClassLabelLg2))) && (
          <Note
            text={buildCorrespondenceClassificationLinks(correspondence, secondLang)}
            title={t("correspondence.globalInformation")}
            alone={true}
            allowEmpty={true}
          />
        )}
      </Row>
      <span>
        {correspondence.descriptionLg1 && (
          <Row>
            <ExplanatoryNote
              text={correspondence.descriptionLg1}
              title={t("correspondence.description", { lng: "fr" })}
              alone={!secondLang}
            />
            {secondLang && (
              <ExplanatoryNote
                text={correspondence.descriptionLg2}
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
