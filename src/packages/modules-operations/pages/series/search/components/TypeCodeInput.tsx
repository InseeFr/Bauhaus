import { useTranslation } from "react-i18next";

import { Select } from "@components/select-rmes";

import { Option } from "@model/SelectOption";

import { useCodelist } from "@utils/hooks/codelist";

import { CL_SOURCE_CATEGORY } from "../../../../../constants/code-lists";

interface TypeCodeInputTypes {
  value: string;
  onChange: (value: string) => void;
}

export const TypeCodeInput = ({ value, onChange }: Readonly<TypeCodeInputTypes>) => {
  const { t } = useTranslation();

  const categories = useCodelist(CL_SOURCE_CATEGORY);

  const options: Option[] = categories?.codes?.map((cat) => {
    return { value: cat.code, label: cat.labelLg1 };
  });

  return (
    <label className="w-100">
      {t("common.operationType")}
      <Select placeholder="" value={value} options={options} onChange={onChange} />
    </label>
  );
};
