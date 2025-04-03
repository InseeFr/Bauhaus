import { Calendar } from 'primereact/calendar';

import './date-picker.scss';

interface DatePickerTypes {
	value: string;
	onChange: (value?: string) => void;
}

export const DatePicker = ({ value, onChange }: Readonly<DatePickerTypes>) => {
	const date = value ? new Date(value) : undefined;
	return (
		<Calendar
			dateFormat="dd/mm/yy"
			value={date}
			onChange={(e) => {
				if (!e.value) {
					onChange();
					return;
				}

				//We set the date in a UTC mode in order to remove the TZ
				onChange(
					new Date(
						Date.UTC(
							e.value.getFullYear(),
							e.value.getMonth(),
							e.value.getDate(),
						),
					).toISOString(),
				);
			}}
		/>
	);
};
