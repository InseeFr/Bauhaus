import { ClientSideError } from "../../../../components/errors-bloc";
import LabelRequired from "../../../../components/label-required";
import { Row } from "../../../../components/layout";
import { Select } from "../../../../components/select-rmes";
import { useUserSeriesList } from "../../../hooks/useUserSeriesList";

interface SeriesProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string;
}
export const Series = ({ label, errorMessage, value, onChange }: Readonly<SeriesProps>) => {
  const { series } = useUserSeriesList();
  const seriesOptions = series
    .filter((series) => !series.idSims)
    .map(({ id, label }) => {
      return { value: id, label: label };
    });
  return (
    <Row className="bauhaus-row">
      <div className="form-group">
        <LabelRequired>{label}</LabelRequired>
        <Select placeholder={label} value={value} options={seriesOptions} onChange={onChange} />
        <ClientSideError id="series-error" error={errorMessage}></ClientSideError>
      </div>
    </Row>
  );
};
