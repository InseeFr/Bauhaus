import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { ContributorsInput } from "@components/business/contributors-input/contributors-input";
import { CreatorsInput } from "@components/business/creators-input";
import { DisseminationStatusInput } from "@components/dissemination-status/disseminationStatus";
import { ClientSideError } from "@components/errors-bloc";
import { TextInput } from "@components/form/input";
import { LabelRequired } from "@components/label-required";
import { Row } from "@components/layout";
import { Select } from "@components/select-rmes";

import { CatalogRecord, Dataset } from "@model/Dataset";
import { Option } from "@model/SelectOption";

import { DatasetsApi } from "@sdk/index";

import { withCodelists } from "@utils/hoc/withCodelists";

import {
  CL_ACCESS_RIGHTS,
  CL_CONF_STATUS,
  CL_PROCESS_STEP,
} from "../../../../../constants/code-lists";
import { useSeriesOperationsOptions } from "../../../../hooks/useSeriesOperationsOptions";
import { convertCodelistToSelectOption } from "../../../../utils/convertCodelistToSelectOption";

type ClientSideErrors = {
  errorMessage?: string[];
  fields?: Record<string, string>;
};

interface InternalManagementTypes {
  editingDataset: Dataset;
  setEditingDataset: (dataset: Dataset) => void;
  clientSideErrors: ClientSideErrors;
  setClientSideErrors: Dispatch<SetStateAction<ClientSideErrors>>;
  [key: string]: any;
}

const InternalManagementTab = ({
  editingDataset,
  setEditingDataset,
  clientSideErrors,
  setClientSideErrors,
  ...props
}: Readonly<InternalManagementTypes>) => {
  const { t } = useTranslation();

  const seriesOperationsOptions = useSeriesOperationsOptions();

  const clAccessRightsOptions = convertCodelistToSelectOption(props[CL_ACCESS_RIGHTS]);

  const clConfStatusOptions = convertCodelistToSelectOption(props[CL_CONF_STATUS]);

  const clProcessStep = convertCodelistToSelectOption(props[CL_PROCESS_STEP]);

  const [archivageUnits, setArchivageUnits] = useState<Option[]>([]);
  useEffect(() => {
    DatasetsApi.getArchivageUnits().then(setArchivageUnits);
  }, []);

  return (
    <>
      <Row>
        <div className="col-md-12 form-group">
          <label htmlFor="altIdentifier">{t("dataset.internalManagement.altId.title")}</label>
          <TextInput
            id="altIdentifier"
            value={editingDataset.altIdentifier}
            onChange={(e) => {
              setEditingDataset({
                ...editingDataset,
                altIdentifier: e.target.value,
              });
              setClientSideErrors((clientSideErrors) => ({
                ...clientSideErrors,
                errorMessage: [],
              }));
            }}
          />
          <ClientSideError
            id="altIdentifier-error"
            error={clientSideErrors?.fields?.altIdentifier}
          ></ClientSideError>
        </div>
      </Row>
      <Row>
        <div className="col-md-12 form-group">
          <CreatorsInput
            mode="organization"
            value={editingDataset.catalogRecord?.creator}
            onChange={(values) => {
              setEditingDataset({
                ...editingDataset,
                catalogRecord: {
                  ...(editingDataset.catalogRecord ?? {}),
                  creator: values as string,
                } as CatalogRecord,
              });
              setClientSideErrors((clientSideErrors) => ({
                ...clientSideErrors,
                errorMessage: [],
              }));
            }}
          />
          <ClientSideError
            id="creator-error"
            error={clientSideErrors?.fields?.creator}
          ></ClientSideError>
        </div>
      </Row>
      <Row>
        <div className="col-md-12 form-group">
          <ContributorsInput
            mode="organization"
            value={editingDataset.catalogRecord?.contributor}
            onChange={(values) => {
              setEditingDataset({
                ...editingDataset,
                catalogRecord: {
                  ...(editingDataset.catalogRecord ?? {}),
                  contributor: values,
                } as CatalogRecord,
              });
              setClientSideErrors((clientSideErrors) => ({
                ...clientSideErrors,
                errorMessage: [],
              }));
            }}
            multi
          />
          <ClientSideError
            id="contributor-error"
            error={clientSideErrors?.fields?.contributor}
          ></ClientSideError>
        </div>
      </Row>
      <Row>
        <div className="col-md-12 form-group">
          <DisseminationStatusInput
            value={editingDataset.disseminationStatus}
            handleChange={(value) => {
              setEditingDataset({
                ...editingDataset,
                disseminationStatus: value,
              });
              setClientSideErrors((clientSideErrors) => ({
                ...clientSideErrors,
                errorMessage: [],
              }));
            }}
            required
          />
          <ClientSideError
            id="disseminationStatus-error"
            error={clientSideErrors?.fields?.disseminationStatus}
          ></ClientSideError>
        </div>
      </Row>
      <Row>
        <div className="col-md-12 form-group">
          <LabelRequired>{t("dataset.internalManagement.generatedBy")}</LabelRequired>
          <Select
            multi
            value={editingDataset.wasGeneratedIRIs}
            options={seriesOperationsOptions}
            itemTemplate={(v) => {
              if (!v.value.includes("/serie/")) {
                return <span className="padding">{v.label}</span>;
              }
              return `${v.label}`;
            }}
            onChange={(values) => {
              setEditingDataset({
                ...editingDataset,
                wasGeneratedIRIs: values,
              });
              setClientSideErrors((clientSideErrors) => ({
                ...clientSideErrors,
                errorMessage: [],
              }));
            }}
          />
          <ClientSideError
            id="wasGeneratedIRIs-error"
            error={clientSideErrors?.fields?.wasGeneratedIRIs}
          ></ClientSideError>
        </div>
      </Row>
      <Row>
        <div className="col-md-12 form-group">
          <label className="w-100 wilco-label-required">
            {t("dataset.internalManagement.accessRights")}
          </label>
          <Select
            value={editingDataset.accessRights}
            options={clAccessRightsOptions}
            onChange={(option) => {
              setEditingDataset({
                ...editingDataset,
                accessRights: option,
              });
            }}
          />
        </div>
      </Row>
      <Row>
        <div className="col-md-12 form-group">
          <label className="w-100 wilco-label-required">
            {t("dataset.internalManagement.confidentialityStatus")}
          </label>
          <Select
            value={editingDataset.confidentialityStatus}
            options={clConfStatusOptions}
            onChange={(option) => {
              setEditingDataset({
                ...editingDataset,
                confidentialityStatus: option,
              });
            }}
          />
        </div>
      </Row>
      <Row>
        <div className="col-md-12 form-group">
          <label className="w-100 wilco-label-required">
            {t("dataset.internalManagement.processStep")}
          </label>
          <Select
            value={editingDataset.processStep}
            options={clProcessStep}
            onChange={(option) => {
              setEditingDataset({
                ...editingDataset,
                processStep: option,
              });
            }}
          />
        </div>
      </Row>
      <Row>
        <div className="col-md-12 form-group">
          <label className="w-100 wilco-label-required">
            {t("dataset.internalManagement.archiveUnit")}
          </label>
          <Select
            value={editingDataset.archiveUnit}
            options={archivageUnits}
            onChange={(option) => {
              setEditingDataset({
                ...editingDataset,
                archiveUnit: option,
              });
            }}
          />
        </div>
      </Row>
    </>
  );
};

export const InternalManagement = withCodelists([
  CL_ACCESS_RIGHTS,
  CL_CONF_STATUS,
  CL_PROCESS_STEP,
])(InternalManagementTab);
