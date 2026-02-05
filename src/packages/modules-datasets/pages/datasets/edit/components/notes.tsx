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
  const { i18n } = useTranslation();
  const tFr = i18n.getFixedT("fr");
  const tEn = i18n.getFixedT("en");

  return (
    <>
      <Row>
        <div className="col-md-6 form-group">
          <label htmlFor="descriptionLg1">{tFr("dataset.notes.abstract")}</label>
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
          <label htmlFor="descriptionLg2">{tEn("dataset.notes.abstract")}</label>
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
          <label htmlFor="descriptionLg1">{tFr("dataset.notes.description")}</label>
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
          <label htmlFor="descriptionLg2">{tEn("dataset.notes.description")}</label>
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
          <label htmlFor="descriptionLg1">{tFr("dataset.notes.warning")}</label>
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
          <label htmlFor="cautionLg2">{tEn("dataset.notes.warning")}</label>
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
