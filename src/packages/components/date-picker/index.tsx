import { Calendar } from 'primereact/calendar';

type DatePickerTypes = {
	value: string;
	onChange: (value: any) => void;
	secondLang?: boolean;
};
export const DatePicker = ({
	value,
	onChange,
	secondLang = false,
}: Readonly<DatePickerTypes>) => {
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
