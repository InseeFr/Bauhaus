import { useTranslation } from "react-i18next";

import { CreationUpdateItems } from "@components/creation-update-items";
import { Row } from "@components/layout";
import { Note } from "@components/note";
import { PublicationStatusItem } from "@components/status";

import { useTitle } from "@utils/hooks/useTitle";
import { renderMarkdownElement } from "@utils/html-utils";

import { Family } from "../../../../../model/operations/family";
import { RelationsView } from "../../../../components/RelationsView";

interface OperationsFamilyVisualizationTypes {
  attr: Family;
  secondLang: boolean;
}

export function OperationsFamilyVisualization({
  attr,
  secondLang,
}: Readonly<OperationsFamilyVisualizationTypes>) {
  const { t } = useTranslation();

  useTitle(t("common.familiesTitle") + " - " + t("common.operationsTitle"), attr?.prefLabelLg1);

  return (
    <>
      <Row>
        <Note
          text={
            <ul>
              <CreationUpdateItems creation={attr.created} update={attr.modified} />
              <PublicationStatusItem label={t("common.familyStatus", { lng: "fr" })} object={attr} gender="female" />
            </ul>
          }
          title={t("app.globalInformationsTitle", { lng: "fr" })}
          alone={true}
        />
      </Row>
      <Row>
        <Note
          text={renderMarkdownElement(attr.abstractLg1)}
          title={t("common.summary", { lng: "fr" })}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            text={renderMarkdownElement(attr.abstractLg2)}
            title={t("common.summary", { lng: "en" })}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>
      <RelationsView
        children={attr.series}
        childrenTitle="childrenSeries"
        childrenPath="series"
        secondLang={secondLang}
      />
    </>
  );
}
