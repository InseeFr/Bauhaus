import { SelectRmes } from '../../../utils';
import { D1 } from '../i18n';
import { LabelRequired } from '@inseefr/wilco';
import { useStampsOptions } from '../../utils/hooks/stamps';

export const CreatorsInput = ({
	value,
	onChange,
	multi = false,
}: {
	value: string | string[];
	onChange: (value: string | string[]) => void;
	multi: boolean;
}) => {
	const stampsOptions = useStampsOptions();
	let creatorsArray = value;
	if (multi && !Array.isArray(value)) {
		creatorsArray = [value];
	}

	return (
		<div>
			<LabelRequired>
				{!multi
					? D1.creatorsInput.creatorTitle
					: D1.creatorsInput.creatorsTitle}
			</LabelRequired>
			<SelectRmes
				placeholder={D1.stampsPlaceholder}
				unclearable
				multi={multi}
				value={creatorsArray}
				options={stampsOptions}
				onChange={(value: string | string[]) => {
					if (!multi) {
						onChange(value);
					} else {
						onChange((value as any[]).map((v) => v.value));
					}
				}}
			/>
		</div>
	);
};
