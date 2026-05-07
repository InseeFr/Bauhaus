import { Calendar } from "primereact/calendar";

import "./date-picker.scss";

interface DatePickerTypes {
  value?: string;
  onChange?: (value?: string) => void;
  inputId?: string;
  disabled?: boolean;
}

export const DatePicker = ({ value, onChange, inputId, disabled }: Readonly<DatePickerTypes>) => {
  const date = value ? new Date(value) : undefined;
  return (
    <Calendar
      inputId={inputId}
      dateFormat="dd/mm/yy"
      value={date}
      disabled={disabled}
      onChange={(e) => {
        if (!onChange) return;
        if (!e.value) {
          onChange();
          return;
        }

        //We set the date in a UTC mode in order to remove the TZ
        onChange(
          new Date(
            Date.UTC(e.value.getFullYear(), e.value.getMonth(), e.value.getDate()),
          ).toISOString(),
        );
      }}
    />
  );
};
