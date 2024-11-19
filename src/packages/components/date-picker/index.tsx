import { Calendar } from 'primereact/calendar';
import './date-picker.scss';

type DatePickerTypes = {
	value: string;
	onChange: (value: string | undefined) => void;
};
export const DatePicker = ({ value, onChange }: Readonly<DatePickerTypes>) => {
	const date = value ? new Date(value) : undefined;
	return (
		<Calendar
			dateFormat="dd/mm/yy"
			value={date}
			onChange={(e) => {
				onChange(e.value?.toISOString());
			}}
		/>
	);
};
