// @ts-ignore
import BootstrapDatePicker from 'react-16-bootstrap-date-picker';
import { D1, D2 } from '../../deprecated-locales';

type DatePickerTypes = {
	value: string;
	onChange: (value: string) => void;
	placement?: string;
	secondLang?: boolean;
};
export const DatePicker = ({
	value,
	onChange,
	placement,
	secondLang = false,
}: Readonly<DatePickerTypes>) => {
	const days = secondLang ? D2.calendarDays : D1.calendarDays;
	const months = secondLang ? D2.calendarMonths : D1.calendarMonths;

	return (
		<BootstrapDatePicker
			value={value}
			calendarPlacement={placement}
			onChange={onChange}
			weekStartsOn={1}
			dayLabels={days}
			monthLabels={months}
		/>
	);
};
