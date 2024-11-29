import { ChangeEventHandler } from 'react';

import { NumberInput } from '@components/form/input';
import { Row } from '@components/layout';

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
