import { ClientSideError } from '@components/errors-bloc';
import { TextInput } from '@components/form/input';
import { Row } from '@components/layout';

import D from '../../../../deprecated-locales';

type YearInputTypes = {
	value: string;
	onChange: (value?: string | number) => void;
	error?: string;
};

export const YearInput = ({
	value,
	onChange,
	error,
}: Readonly<YearInputTypes>) => {
	return (
		<Row className="bauhaus-row">
			<div className="form-group">
				<label htmlFor="year">{D.year}</label>
				<TextInput
					id="year"
					value={value}
					onChange={(e) => {
						onChange(e.target.value);
					}}
					aria-describedby="year"
				/>
				<ClientSideError id="year-error" error={error}></ClientSideError>
			</div>
		</Row>
	);
};
