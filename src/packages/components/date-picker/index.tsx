import { Calendar } from 'primereact/calendar';

type DatePickerTypes = {
	value: string;
	onChange: (value: any) => void;
};
export const DatePicker = ({ value, onChange }: Readonly<DatePickerTypes>) => {
	return (
		<>
			<Calendar
				value={new Date(value)}
				onChange={(e) => {
					onChange(e.value?.toISOString());
				}}
			/>
		</>
	);
};
