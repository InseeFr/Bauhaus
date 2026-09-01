import { Calendar } from "primereact/calendar";

import "./date-picker.css";

interface DatePickerTypes {
  value?: string;
  onChange?: (value?: string) => void;
  inputId?: string;
  disabled?: boolean;
  className?: string;
}

export const DatePicker = ({
  value,
  onChange,
  inputId,
  disabled,
  className,
}: Readonly<DatePickerTypes>) => {
  const date = value ? new Date(value) : undefined;

  return (
    <Calendar
      className={className}
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
