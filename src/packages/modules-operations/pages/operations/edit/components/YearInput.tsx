import { ClientSideError } from "@components/errors-bloc";
import { TextInput } from "@components/form/input";
import { Row } from "@components/layout";

import { useTranslation } from "react-i18next";

interface YearInputTypes {
  value: string;
  onChange: (value?: string | number) => void;
  error?: string;
}

export const YearInput = ({ value, onChange, error }: Readonly<YearInputTypes>) => {
  const { t } = useTranslation();

  return (
    <Row className="bauhaus-row">
      <div className="form-group">
        <label htmlFor="year">{t("common.year")}</label>
        <TextInput
          id="year"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          aria-describedby="year-error"
        />
        <ClientSideError id="year-error" error={error}></ClientSideError>
      </div>
    </Row>
  );
};
