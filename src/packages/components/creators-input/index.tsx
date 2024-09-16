import { D1 } from '../i18n';
import { useStampsOptions } from '../../utils/hooks/stamps';
import { Select } from '../select-rmes';
import LabelRequired from '../label-required';

export const CreatorsInput = ({
	value,
	onChange,
	multi = false,
}: Readonly<{
	value: string | string[];
	onChange: (value: string | string[]) => void;
	multi?: boolean;
}>) => {
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
			<Select
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
