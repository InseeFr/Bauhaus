import { Select } from "@components/select-rmes";
import { useClassifications } from "../../../../hooks/useClassifications";

type Props = Readonly<{
  excludeId?: string;
  value: string | undefined;
  onChange: (value: string) => void;
}>;

export const ClassificationSelect = ({ excludeId, value, onChange }: Props) => {
  const { data: classifications } = useClassifications();

  const options =
    classifications
      ?.filter((c) => c.id !== excludeId)
      ?.map((c) => ({ value: c.id, label: c.label })) ?? [];

  return <Select value={value} options={options} onChange={onChange} />;
};
