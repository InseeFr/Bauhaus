import { NumberInput, Row } from '../../../../components';
import { ChangeEventHandler } from 'react';
import D from '../../../../deprecated-locales';

type YearInputTypes = {
	value: string;
	onChange: ChangeEventHandler<HTMLInputElement>;
};

export const YearInput = ({ value, onChange }: Readonly<YearInputTypes>) => {
	return (
		<Row className="bauhaus-row">
			<div className="form-group">
				<label htmlFor="year">{D.year}</label>
				<NumberInput id="year" value={value} onChange={onChange} />
			</div>
		</Row>
	);
};
