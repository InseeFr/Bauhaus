import { CreationUpdateItems } from "@components/creation-update-items";
import { Row } from "@components/layout";
import { Note } from "@components/note";
import { PublicationStatusItem } from "@components/status";

import { useTitle } from "@utils/hooks/useTitle";

import { useTranslation } from "react-i18next";

import { Operation } from "../../../../../model/Operation";
import { RelationsView } from "../../../../components/RelationsView";

interface OperationsOperationVisualizationTypes {
  attr: Operation;
  secondLang: boolean;
}

export function OperationsOperationVisualization({
  attr,
  secondLang,
}: Readonly<OperationsOperationVisualizationTypes>) {
  const { t } = useTranslation();

  useTitle(t("common.operationsTitle"), attr?.prefLabelLg1);

  return (
    <>
      <Row>
        <Note
          text={
            <ul>
              <CreationUpdateItems creation={attr.created} update={attr.modified} />
              <PublicationStatusItem
                label={t("common.operationStatus")}
                object={attr}
                gender="female"
              />
              <li>
                {t("common.year")} : {attr.year}
              </li>
            </ul>
          }
          title={t("app.globalInformationsTitle", { lng: "fr" })}
          alone={true}
        />
      </Row>
      <Row>
        <Note
          text={attr.altLabelLg1}
          title={t("app.altLabel", { lng: "fr" })}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note text={attr.altLabelLg2} title={t("app.altLabel", { lng: "en" })} alone={false} allowEmpty={true} />
        )}
      </Row>
      <RelationsView
        parent={attr.series}
        parentTitle="parentSeries"
        parentPath="series"
        secondLang={secondLang}
      />
    </>
  );
}
