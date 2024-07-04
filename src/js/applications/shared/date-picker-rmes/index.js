import DatePicker from 'react-16-bootstrap-date-picker';
import { D1, D2 } from 'js/i18n';

function DatePickerRmes({ value, onChange, placement, secondLang = false }) {
	const days = secondLang ? D2.calendarDays : D1.calendarDays;
	const months = secondLang ? D2.calendarMonths : D1.calendarMonths;

	return (
		<DatePicker
			value={value}
			calendarPlacement={placement}
			onChange={onChange}
			weekStartsOn={1}
			dayLabels={days}
			monthLabels={months}
		/>
	);
}

export default DatePickerRmes;
