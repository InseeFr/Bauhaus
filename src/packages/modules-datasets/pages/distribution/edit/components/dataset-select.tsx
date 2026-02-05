import { ClientSideError } from "@components/errors-bloc";
import LabelRequired from "@components/label-required";
import { Select } from "@components/select-rmes";

import { D1 } from "../../../../../deprecated-locales";
import { useDatasetsForDistributions } from "../../../../datasets";

type DatasetSelectProps = {
  disabled: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export const DatasetSelect = ({ disabled, value, onChange, error }: DatasetSelectProps) => {
  const { data: datasets } = useDatasetsForDistributions();

  const datasetsOptions =
    datasets?.map((dataset) => ({
      value: dataset.id,
      label: dataset.label,
    })) ?? [];

  return (
    <div className="col-md-12 form-group">
      <LabelRequired htmlFor="idDataset">{D1.datasetTitle}</LabelRequired>
      <Select
        disabled={disabled}
        placeholder={D1.datasetTitle}
        value={value}
        options={datasetsOptions}
        onChange={onChange}
        aria-describedby={error ? "idDataset-error" : undefined}
      />
      <ClientSideError id="idDataset-error" error={error}></ClientSideError>
    </div>
  );
};
