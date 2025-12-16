import { TextInput } from '@components/form/input';

import { D1 } from '../../../../../deprecated-locales';

const FORMAT_OPTIONS = ['CSV', 'PARQUET'];

type FormatInputProps = {
	value: string;
	onChange: (value: string) => void;
};

export const FormatInput = ({ value, onChange }: FormatInputProps) => {
	return (
		<div className="col-md-12 form-group">
			<label htmlFor="format">{D1.formatTitle}</label>
			<TextInput
				id="format"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				list="format-list"
			/>
			<datalist id="format-list">
				{FORMAT_OPTIONS.map((option) => (
					<option key={option} value={option}></option>
				))}
			</datalist>
		</div>
	);
};
