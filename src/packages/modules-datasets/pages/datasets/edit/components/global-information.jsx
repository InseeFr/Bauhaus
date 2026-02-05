import { useTranslation } from "react-i18next";

import { OrganisationInput } from "@components/business/stamps-input/stamps-input";
import { ClientSideError } from "@components/errors-bloc";
import { TextInput } from "@components/form/input";
import { InputMulti } from "@components/ui/forms/input-multi";
import LabelRequired from "@components/label-required";
import { Row } from "@components/layout";
import { Select } from "@components/select-rmes";

import { withCodesLists } from "@utils/hoc/withCodesLists";

import { CL_FREQ } from "../../../../../constants/code-lists";
import { convertCodesListsToSelectOption } from "../../../../utils/codelist-to-select-options";
import { useThemes } from "../../../../hooks/useThemes";

const GlobalInformationTab = ({
  editingDataset,
  setEditingDataset,
  clientSideErrors,
  setClientSideErrors,
  ...props
}) => {
  const { i18n } = useTranslation();
  const tFr = i18n.getFixedT("fr");
  const tEn = i18n.getFixedT("en");

  const clFreqOptions = convertCodesListsToSelectOption(props[CL_FREQ]);

  const { data: themesOptions = [] } = useThemes();

  return (
    <>
      <Row>
        <div className="col-md-6 form-group">
          <LabelRequired htmlFor="labelLg1">
            {tFr("dataset.globalInformation.mainTitle")}
          </LabelRequired>
          <TextInput
            id="labelLg1"
            value={editingDataset.labelLg1}
            onChange={(e) => {
              setEditingDataset({
                ...editingDataset,
                labelLg1: e.target.value,
              });
              setClientSideErrors((clientSideErrors) => ({
                ...clientSideErrors,
                errorMessage: [],
              }));
            }}
          />
          <ClientSideError error={clientSideErrors?.fields?.labelLg1}></ClientSideError>
        </div>
        <div className="col-md-6 form-group">
          <LabelRequired htmlFor="labelLg2">
            {tEn("dataset.globalInformation.mainTitle")}
          </LabelRequired>
          <TextInput
            id="labelLg2"
            value={editingDataset.labelLg2}
            onChange={(e) => {
              setEditingDataset({
                ...editingDataset,
                labelLg2: e.target.value,
              });
              setClientSideErrors((clientSideErrors) => ({
                ...clientSideErrors,
                errorMessage: [],
              }));
            }}
          />
          <ClientSideError error={clientSideErrors?.fields?.labelLg2}></ClientSideError>
        </div>
      </Row>
      <Row>
        <div className="col-md-6 form-group">
          <label htmlFor="subtitleLg1">{tFr("dataset.globalInformation.subtitle")}</label>
          <TextInput
            id="subtitleLg1"
            value={editingDataset.subTitleLg1}
            onChange={(e) => {
              setEditingDataset({
                ...editingDataset,
                subTitleLg1: e.target.value,
              });
            }}
          />
        </div>
        <div className="col-md-6 form-group">
          <label htmlFor="subtitleLg2">{tEn("dataset.globalInformation.subtitle")}</label>
          <TextInput
            id="subtitleLg2"
            value={editingDataset.subTitleLg2}
            onChange={(e) => {
              setEditingDataset({
                ...editingDataset,
                subTitleLg2: e.target.value,
              });
            }}
          />
        </div>
      </Row>
      <Row>
        <div className="col-md-12 form-group">
          <label className="w-100 wilco-label-required">
            {tFr("dataset.globalInformation.firstReleaseDate")}
            <input
              type="date"
              className="form-control"
              value={editingDataset.issued}
              onChange={(e) => {
                setEditingDataset({
                  ...editingDataset,
                  issued: e.target.value,
                });
              }}
            />
          </label>
        </div>
      </Row>
      <Row>
        <div className="col-md-12 form-group">
          <label className="w-100 wilco-label-required">
            {tFr("dataset.globalInformation.modificationDate")}
            <input
              type="date"
              className="form-control"
              value={editingDataset.updated}
              onChange={(e) => {
                setEditingDataset({
                  ...editingDataset,
                  updated: e.target.value,
                });
              }}
            />
          </label>
        </div>
      </Row>
      <Row>
        <div className="col-md-12 form-group">
          <label className="w-100 wilco-label-required">
            {tFr("dataset.globalInformation.updateFrequency")}
            <Select
              value={editingDataset.accrualPeriodicity}
              options={clFreqOptions}
              onChange={(value) => {
                setEditingDataset({
                  ...editingDataset,
                  accrualPeriodicity: value,
                });
              }}
            />
          </label>
        </div>
      </Row>
      <Row>
        <div className="col-md-12 form-group">
          <label className="w-100 wilco-label-required">
            {tFr("dataset.globalInformation.dataProvider")}
            <OrganisationInput
              multi
              value={editingDataset.creators}
              onChange={(values) => {
                setEditingDataset({
                  ...editingDataset,
                  creators: values,
                });
              }}
            />
          </label>
        </div>
      </Row>
      <Row>
        <div className="col-md-12 form-group">
          <label className="w-100 wilco-label-required">
            {tFr("dataset.globalInformation.publicationProvider")}
            <OrganisationInput
              value={editingDataset.publisher}
              onChange={(values) => {
                setEditingDataset({
                  ...editingDataset,
                  publisher: values,
                });
              }}
            />
          </label>
        </div>
      </Row>
      <Row>
        <div className="col-md-12 form-group">
          <label className="w-100 wilco-label-required">
            {tFr("dataset.globalInformation.theme")}
            <Select
              multi
              value={editingDataset.themes}
              options={themesOptions}
              onChange={(values) => {
                setEditingDataset({
                  ...editingDataset,
                  themes: values,
                });
              }}
            />
          </label>
        </div>
      </Row>
      <InputMulti
        inputLg1={editingDataset.keywords?.lg1}
        inputLg2={editingDataset.keywords?.lg2}
        labelLg1={tFr("dataset.globalInformation.keywords")}
        labelLg2={tEn("dataset.globalInformation.keywords")}
        handleChangeLg1={(keywords) => {
          setEditingDataset({
            ...editingDataset,
            keywords: {
              ...editingDataset.keywords,
              lg1: keywords,
            },
          });
        }}
        handleChangeLg2={(keywords) => {
          setEditingDataset({
            ...editingDataset,
            keywords: {
              ...editingDataset.keywords,
              lg2: keywords,
            },
          });
        }}
      />
      <Row>
        <div className="col-md-6 form-group">
          <label htmlFor="landingPageLg1">{tFr("dataset.globalInformation.landingPage")}</label>
          <TextInput
            id="landingPageLg1"
            value={editingDataset.landingPageLg1}
            onChange={(e) => {
              setEditingDataset({
                ...editingDataset,
                landingPageLg1: e.target.value,
              });
            }}
          />
        </div>
        <div className="col-md-6 form-group">
          <label htmlFor="landingPageLg2">{tEn("dataset.globalInformation.landingPage")}</label>
          <TextInput
            id="landingPageLg2"
            value={editingDataset.landingPageLg2}
            onChange={(e) => {
              setEditingDataset({
                ...editingDataset,
                landingPageLg2: e.target.value,
              });
            }}
          />
        </div>
      </Row>
      <InputMulti
        inputLg1={editingDataset.linkedDocuments}
        labelLg1={tFr("dataset.globalInformation.linkedDocuments")}
        handleChangeLg1={(linkedDocuments) => {
          setEditingDataset({
            ...editingDataset,
            linkedDocuments,
          });
        }}
      />
    </>
  );
};

export const GlobalInformation = withCodesLists([CL_FREQ])(GlobalInformationTab);
