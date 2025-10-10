import { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import type { NumericRepresentation as NumericRepresentationType } from '../../types/api';

interface NumericRepresentationProps {
	representation?: NumericRepresentationType;
	onChange: (representation: NumericRepresentationType | undefined) => void;
}

const NUMERIC_TYPE_OPTIONS = [
	{ value: 'BigInteger', label: 'BigInteger' },
	{ value: 'Integer', label: 'Integer' },
	{ value: 'Short', label: 'Short' },
	{ value: 'Decimal', label: 'Decimal' },
	{ value: 'Float', label: 'Float' },
	{ value: 'Double', label: 'Double' },
	{ value: 'Count', label: 'Count' },
	{ value: 'Incremental', label: 'Incremental' },
];

export const NumericRepresentation = ({
	representation,
	onChange,
}: Readonly<NumericRepresentationProps>) => {
	const { t } = useTranslation();
	const [numericTypeCode, setNumericTypeCode] = useState(
		representation?.NumericTypeCode || 'Integer',
	);
	const [minValue, setMinValue] = useState(
		representation?.NumberRange?.Low?.['#text'] || '',
	);
	const [maxValue, setMaxValue] = useState(
		representation?.NumberRange?.High?.['#text'] || '',
	);
	const [hasMin, setHasMin] = useState(!!representation?.NumberRange?.Low);
	const [hasMax, setHasMax] = useState(!!representation?.NumberRange?.High);

	useEffect(() => {
		setNumericTypeCode(representation?.NumericTypeCode || 'Integer');
		setMinValue(representation?.NumberRange?.Low?.['#text'] || '');
		setMaxValue(representation?.NumberRange?.High?.['#text'] || '');
		setHasMin(!!representation?.NumberRange?.Low);
		setHasMax(!!representation?.NumberRange?.High);
	}, [representation]);

	useEffect(() => {
		const numberRange: {
			Low?: { '@isInclusive': string; '#text': string };
			High?: { '@isInclusive': string; '#text': string };
		} = {};

		if (hasMin) {
			numberRange.Low = {
				'@isInclusive': 'true',
				'#text': minValue,
			};
		}

		if (hasMax) {
			numberRange.High = {
				'@isInclusive': 'true',
				'#text': maxValue,
			};
		}

		const newRepresentation: NumericRepresentationType = {
			NumericTypeCode: numericTypeCode,
			...(Object.keys(numberRange).length > 0 && {
				NumberRange: numberRange as {
					Low: { '@isInclusive': string; '#text': string };
					High: { '@isInclusive': string; '#text': string };
				},
			}),
		};

		onChange(newRepresentation);
	}, [numericTypeCode, minValue, maxValue, hasMin, hasMax, onChange]);

	return (
		<>
			<div className="flex flex-column gap-2">
				<label htmlFor="numeric-type">
					{t('physicalInstance.view.numeric.type')}
				</label>
				<Dropdown
					id="numeric-type"
					name="numericType"
					value={numericTypeCode}
					onChange={(e) => setNumericTypeCode(e.value)}
					options={NUMERIC_TYPE_OPTIONS}
					placeholder={t('physicalInstance.view.numeric.selectType')}
				/>
			</div>

			<div className="flex flex-column gap-2">
				{hasMin ? (
					<>
						<label htmlFor="min-value">
							{t('physicalInstance.view.numeric.min')}
						</label>
						<div className="flex gap-2">
							<InputText
								id="min-value"
								name="minValue"
								type="number"
								value={minValue}
								onChange={(e) => setMinValue(e.target.value)}
								className="flex-1"
							/>
							<Button
								type="button"
								label={t('physicalInstance.view.delete')}
								outlined
								onClick={() => {
									setHasMin(false);
									setMinValue('');
								}}
							/>
						</div>
					</>
				) : (
					<Button
						type="button"
						label={t('physicalInstance.view.numeric.addMinBound')}
						outlined
						onClick={() => {
							setHasMin(true);
							setMinValue('0');
						}}
					/>
				)}
			</div>

			<div className="flex flex-column gap-2">
				{hasMax ? (
					<>
						<label htmlFor="max-value">
							{t('physicalInstance.view.numeric.max')}
						</label>
						<div className="flex gap-2">
							<InputText
								id="max-value"
								name="maxValue"
								type="number"
								value={maxValue}
								onChange={(e) => setMaxValue(e.target.value)}
								className="flex-1"
							/>
							<Button
								type="button"
								label={t('physicalInstance.view.delete')}
								outlined
								onClick={() => {
									setHasMax(false);
									setMaxValue('');
								}}
							/>
						</div>
					</>
				) : (
					<Button
						type="button"
						label={t('physicalInstance.view.numeric.addMaxBound')}
						outlined
						onClick={() => {
							setHasMax(true);
							setMaxValue('0');
						}}
					/>
				)}
			</div>
		</>
	);
};
