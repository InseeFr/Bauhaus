import { Select } from "@components/select-rmes";
import { useClassifications } from "../../../../hooks";
import { Classification } from "../../../../types";

type Props = Readonly<{
  excludeId?: string;
  value: string | undefined;
  onChange: (value: string) => void;
}>;

export const ClassificationSelect = ({ excludeId, value, onChange }: Props) => {
  const { classifications } = useClassifications();

  const options =
    (classifications as Classification[] | undefined)
      ?.filter((c) => c.id !== excludeId)
      ?.map((c) => ({ value: c.id, label: (c as any).label })) ?? [];

  return <Select value={value} options={options} onChange={onChange} />;
};
