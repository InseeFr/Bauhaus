import React from 'react';
import DatePicker from 'react-16-bootstrap-date-picker';
import D from 'js/i18n';

function DatePickerRmes({ value, onChange, placement }) {
	const days = D.calendarDays;
	const months = D.calendarMonths;

	return (
		<DatePicker
			className="form-control"
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
