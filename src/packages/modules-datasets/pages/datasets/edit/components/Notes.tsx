import { useTranslation } from "react-i18next";

import { Row } from "@components/layout";
import { MDEditor } from "@components/rich-editor/react-md-editor";

import { Dataset } from "@model/Dataset";

export const Notes = ({
  editingDataset,
  setEditingDataset,
}: Readonly<{
  editingDataset: Dataset;
  setEditingDataset: (dataset: Dataset) => void;
}>) => {
  const { t } = useTranslation();

  return (
    <>
      <Row>
        <div className="col-md-6 form-group">
          <label htmlFor="descriptionLg1">{t("dataset.notes.abstract", { lng: "fr" })}</label>
          <MDEditor
            text={editingDataset.abstractLg1}
            handleChange={(value) => {
              setEditingDataset({
                ...editingDataset,
                abstractLg1: value,
              });
            }}
          />
        </div>
        <div className="col-md-6 form-group">
          <label htmlFor="descriptionLg2">{t("dataset.notes.abstract", { lng: "en" })}</label>
          <MDEditor
            text={editingDataset.abstractLg2}
            handleChange={(value) => {
              setEditingDataset({
                ...editingDataset,
                abstractLg2: value,
              });
            }}
          />
        </div>
      </Row>
      <Row>
        <div className="col-md-6 form-group">
          <label htmlFor="descriptionLg1">{t("dataset.notes.description", { lng: "fr" })}</label>
          <MDEditor
            text={editingDataset.descriptionLg1}
            handleChange={(value) => {
              setEditingDataset({
                ...editingDataset,
                descriptionLg1: value,
              });
            }}
          />
        </div>
        <div className="col-md-6 form-group">
          <label htmlFor="descriptionLg2">{t("dataset.notes.description", { lng: "en" })}</label>
          <MDEditor
            text={editingDataset.descriptionLg2}
            handleChange={(value) => {
              setEditingDataset({
                ...editingDataset,
                descriptionLg2: value,
              });
            }}
          />
        </div>
      </Row>

      <Row>
        <div className="col-md-6 form-group">
          <label htmlFor="descriptionLg1">{t("dataset.notes.warning", { lng: "fr" })}</label>
          <MDEditor
            text={editingDataset.cautionLg1}
            handleChange={(value) => {
              setEditingDataset({
                ...editingDataset,
                cautionLg1: value,
              });
            }}
          />
        </div>
        <div className="col-md-6 form-group">
          <label htmlFor="cautionLg2">{t("dataset.notes.warning", { lng: "en" })}</label>
          <MDEditor
            text={editingDataset.cautionLg2}
            handleChange={(value) => {
              setEditingDataset({
                ...editingDataset,
                cautionLg2: value,
              });
            }}
          />
        </div>
      </Row>
    </>
  );
};
