import { SelectRmes } from '../../utils';
import { D1 } from '../i18n/build-dictionary';
import { LabelRequired } from '@inseefr/wilco';
import { useStampsOptions } from '../../new-architecture/utils/hooks/stamps';

const CreatorsInput = ({ value, onChange, multi }) => {
	const stampsOptions = useStampsOptions();
	let creatorsArray = value;
	if (multi !== false && !Array.isArray(value)) {
		creatorsArray = [value];
	}

	return (
		<div>
			<LabelRequired>
				{multi === false ? D1.creatorTitle : D1.creatorsTitle}
			</LabelRequired>
			<SelectRmes
				placeholder={D1.stampsPlaceholder}
				unclearable
				multi={multi ?? true}
				value={creatorsArray}
				options={stampsOptions}
				onChange={(value) => {
					if (multi === false) {
						onChange(value);
					} else {
						onChange(value.map((v) => v.value));
					}
				}}
			/>
		</div>
	);
};

export default CreatorsInput;
