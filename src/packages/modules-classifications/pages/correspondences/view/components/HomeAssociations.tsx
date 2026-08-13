import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { DataTable } from "@components/datatable";
import { Row } from "@components/layout";
import { Note } from "@components/note";

import { sortArray } from "@utils/array-utils";

const sortById = sortArray("id");

export const HomeAssociations = ({
  id,
  associations,
  correspondence,
  secondLang,
}: {
  id: string;
  associations: any;
  correspondence: any;
  secondLang: boolean;
}) => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { firstAltLabelLg1, firstAltLabelLg2, secondAltLabelLg1, secondAltLabelLg2 } =
    correspondence;

  const { sourceLabelLg2, targetLabelLg2 } = associations[0];

  if (secondLang && !sourceLabelLg2 && !targetLabelLg2) return null;

  const data = sortById(associations).map((a: any) => {
    const [idS, idT] = a.id.split("-");
    return {
      source: `${idS} - ${secondLang ? a["sourceLabelLg2"] : a["sourceLabelLg1"]}`,
      target: `${idT} - ${secondLang ? a["targetLabelLg2"] : a["targetLabelLg1"]}`,
      id: a.id,
    };
  });

  const sourceLabel = secondLang ? firstAltLabelLg2 : firstAltLabelLg1;
  const targetLabel = secondLang ? secondAltLabelLg2 : secondAltLabelLg1;

  return (
    <Row>
      <Note
        text={
          <DataTable
            globalFilterFields={["source", "target"]}
            value={data}
            onRowSelect={(e: any) => {
              navigate(`association/${e.data.id}`);
            }}
          >
            <Column
              field="source"
              header={`${t("correspondence.sourceClassification")}${sourceLabel && ` : ${sourceLabel}`}`}
            ></Column>
            <Column
              field="target"
              header={`${t("correspondence.targetClassification")}${sourceLabel && ` : ${targetLabel}`}`}
            ></Column>
          </DataTable>
        }
        title={t("correspondence.associationList")}
        alone={true}
        allowEmpty={true}
      />
    </Row>
  );
};
