import { useTranslation } from "react-i18next";

import { Row } from "@components/layout";
import { MDEditor } from "@components/rich-editor/react-md-editor";
import { Select } from "@components/select-rmes";

import { Dataset, WasDerivedFrom } from "@model/Dataset";

import { useDatasets } from "../../../../hooks/useDatasets";

export const Lineage = ({
  editingDataset,
  setEditingDataset,
}: Readonly<{
  editingDataset: Dataset;
  setEditingDataset: (dataset: Dataset) => void;
}>) => {
  const { t } = useTranslation();

  const { data: datasets = [] } = useDatasets();
  const sourceOptions = datasets
    .filter(({ id }) => id !== editingDataset.id)
    .map(({ id, label }) => ({ value: id, label }));

  const wasDerivedFrom = editingDataset.wasDerivedFrom ?? { datasets: [] };
  // le back n'enregistre une description qu'accompagnée d'au moins un jeu source
  const hasSources = (wasDerivedFrom.datasets?.length ?? 0) > 0;
  const updateWasDerivedFrom = (changes: Partial<WasDerivedFrom>) =>
    setEditingDataset({
      ...editingDataset,
      wasDerivedFrom: { ...wasDerivedFrom, ...changes },
    });

  return (
    <>
      <Row>
        <div className="col-md-12 form-group">
          <label className="w-100" htmlFor="wasDerivedFrom">
            {t("dataset.lineage.sources")}
          </label>
          <Select
            multi
            inputId="wasDerivedFrom"
            value={wasDerivedFrom.datasets}
            options={sourceOptions}
            onChange={(values: string[]) => updateWasDerivedFrom({ datasets: values })}
          />
        </div>
      </Row>
      {!hasSources && <p>{t("dataset.lineage.descriptionNeedsSources")}</p>}
      <Row>
        <div className="col-md-6 form-group">
          <label>{t("dataset.lineage.description", { lng: "fr" })}</label>
          <MDEditor
            text={wasDerivedFrom.descriptionLg1}
            textareaProps={{ disabled: !hasSources }}
            handleChange={(value) => updateWasDerivedFrom({ descriptionLg1: value })}
          />
        </div>
        <div className="col-md-6 form-group">
          <label>{t("dataset.lineage.description", { lng: "en" })}</label>
          <MDEditor
            text={wasDerivedFrom.descriptionLg2}
            textareaProps={{ disabled: !hasSources }}
            handleChange={(value) => updateWasDerivedFrom({ descriptionLg2: value })}
          />
        </div>
      </Row>
    </>
  );
};
