import { Select } from '@components/select-rmes';

import { useCodesList } from '@utils/hooks/codeslist';

import D from '../../../deprecated-locales';
import { Option } from '../../../model/SelectOption';
import { CL_SOURCE_CATEGORY } from '../../../redux/actions/constants/codeList';

interface TypeCodeInputTypes {
	value: string;
	onChange: (value: string) => void;
}
export const TypeCodeInput = ({
	value,
	onChange,
}: Readonly<TypeCodeInputTypes>) => {
	const categories = useCodesList(CL_SOURCE_CATEGORY);
	const options: Option[] = categories?.codes?.map((cat) => {
		return { value: cat.code, label: cat.labelLg1 };
	});

	return (
		<label className="w-100">
			{D.operationType}

			<Select
				placeholder=""
				value={value}
				options={options}
				onChange={onChange}
			/>
		</label>
	);
};
