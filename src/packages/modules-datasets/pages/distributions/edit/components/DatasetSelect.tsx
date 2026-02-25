import { useTranslation } from "react-i18next";

import { ClientSideError } from "@components/errors-bloc";
import LabelRequired from "@components/label-required";
import { Select } from "@components/select-rmes";

import { useDatasetsForDistributions } from "../../../../hooks/useDatasetsForDistributions";

type DatasetSelectProps = {
  disabled: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export const DatasetSelect = ({
  disabled,
  value,
  onChange,
  error,
}: Readonly<DatasetSelectProps>) => {
  const { t } = useTranslation();

  const { data: datasets } = useDatasetsForDistributions();

  const datasetsOptions =
    datasets?.map((dataset) => ({
      value: dataset.id,
      label: dataset.label,
    })) ?? [];

  return (
    <div className="col-md-12 form-group">
      <LabelRequired htmlFor="idDataset">{t("dataset.title")}</LabelRequired>
      <Select
        disabled={disabled}
        placeholder={t("dataset.title")}
        value={value}
        options={datasetsOptions}
        onChange={onChange}
        aria-describedby={error ? "idDataset-error" : undefined}
      />
      <ClientSideError id="idDataset-error" error={error}></ClientSideError>
    </div>
  );
};
