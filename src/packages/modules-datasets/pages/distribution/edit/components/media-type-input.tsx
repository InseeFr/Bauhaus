import { TextInput } from '@components/form/input';

import D from '../../../../../deprecated-locales/build-dictionary';

const MEDIA_TYPE_OPTIONS = ['CSV', 'PARQUET', 'XSLX'];

type MediaTypeInputProps = {
	value: string;
	onChange: (value: string) => void;
};

export const MediaTypeInput = ({ value, onChange }: MediaTypeInputProps) => {
	return (
		<div className="col-md-6 form-group">
			<label htmlFor="mediaType">{D.mediaTypeTitle}</label>
			<TextInput
				id="mediaType"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				list="mediaType-list"
			/>
			<datalist id="mediaType-list">
				{MEDIA_TYPE_OPTIONS.map((option) => (
					<option key={option} value={option}></option>
				))}
			</datalist>
		</div>
	);
};
