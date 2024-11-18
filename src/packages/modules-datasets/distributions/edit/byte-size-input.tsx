import { NumberInput } from '@components/form/input';

import { D1 } from '../../../deprecated-locales';
import { Distribution } from '../../../model/Dataset';

export const ByteSizeInput = ({
	value,
	onChange,
}: Readonly<{
	value: Distribution;
	onChange: (distribution: Distribution) => void;
}>) => {
	return (
		<div className="col-md-12 form-group">
			<label htmlFor="taille">{D1.tailleTitle}</label>
			<NumberInput
				id="taille"
				value={value.byteSize}
				onChange={(e) =>
					onChange({
						...value,
						byteSize: e.target.value,
					})
				}
			/>
		</div>
	);
};
