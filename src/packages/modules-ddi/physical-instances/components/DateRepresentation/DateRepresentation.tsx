import { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';
import type { DateTimeRepresentation } from '../../types/api';

interface DateRepresentationProps {
	representation?: DateTimeRepresentation;
	onChange: (representation: DateTimeRepresentation | undefined) => void;
}

const DATE_TYPE_OPTIONS = [
	{ value: 'DateTime', label: 'DateTime' },
	{ value: 'Date', label: 'Date' },
	{ value: 'Time', label: 'Time' },
	{ value: 'Year', label: 'Year' },
	{ value: 'Month', label: 'Month' },
	{ value: 'Day', label: 'Day' },
	{ value: 'MonthDay', label: 'MonthDay' },
	{ value: 'YearMonth', label: 'YearMonth' },
	{ value: 'Duration', label: 'Duration' },
	{ value: 'Timespan', label: 'Timespan' },
];

export const DateRepresentation = ({
	representation,
	onChange,
}: Readonly<DateRepresentationProps>) => {
	const { t } = useTranslation();
	const [dateTypeCode, setDateTypeCode] = useState(
		representation?.DateTypeCode || 'Date',
	);

	useEffect(() => {
		setDateTypeCode(representation?.DateTypeCode || 'Date');
	}, [representation]);

	useEffect(() => {
		const newRepresentation: DateTimeRepresentation = {
			DateTypeCode: dateTypeCode,
		};

		onChange(newRepresentation);
	}, [dateTypeCode, onChange]);

	return (
		<div className="flex flex-column gap-2">
			<label htmlFor="date-type">
				{t('physicalInstance.view.date.type')}
			</label>
			<Dropdown
				id="date-type"
				name="dateType"
				value={dateTypeCode}
				onChange={(e) => setDateTypeCode(e.value)}
				options={DATE_TYPE_OPTIONS}
				placeholder={t('physicalInstance.view.date.selectType')}
			/>
		</div>
	);
};
