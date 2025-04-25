import { useStampsOptions } from '../../utils/hooks/stamps';
import D, { D1 } from '../i18n';
import LabelRequired from '../label-required';
import { Select } from '../select-rmes';

export const CreatorsInput = ({
	value,
	onChange,
	multi = false,
	required = true,
	lang = 'first',
}: Readonly<{
	value: string | string[];
	onChange: (value: string | string[]) => void;
	multi?: boolean;
	required?: boolean;
	lang: 'first' | 'default';
}>) => {
	const stampsOptions = useStampsOptions();

	let creatorsArray = value;
	if (multi && !Array.isArray(value)) {
		creatorsArray = [value];
	}

	const Dictionnary = lang === 'first' ? D1 : D;
	const label = !multi
		? Dictionnary.creatorsInput.creatorTitle
		: Dictionnary.creatorsInput.creatorsTitle;

	return (
		<>
			{required ? (
				<LabelRequired>{label}</LabelRequired>
			) : (
				<label>{label}</label>
			)}

			<Select
				placeholder={Dictionnary.stampsPlaceholder}
				value={creatorsArray}
				options={stampsOptions}
				onChange={(value: string | string[]) => {
					if (!multi) {
						onChange(value);
					} else {
						onChange((value as any[]).map((v) => v.value));
					}
				}}
				multi={multi}
			/>
		</>
	);
};
