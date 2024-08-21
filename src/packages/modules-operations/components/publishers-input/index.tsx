import { useSelector } from 'react-redux';
import { D1 } from '../../i18n/build-dictionary';
import * as ItemToSelectModel from '../../../utils/item-to-select-model';
import { Select } from '../../../components';
import { ReduxModel } from '../../../redux/model';
import { Option } from '../../../model/SelectOption';

type PublishersInputTypes = {
	value: string;
	onChange: (value: string) => void;
};
const PublishersInput = ({ value, onChange }: PublishersInputTypes) => {
	const organisations = useSelector(
		(state: ReduxModel) => state.operationsOrganisations.results
	);
	const organisationsOptions = ItemToSelectModel.toSelectModel(organisations);

	const publishersArray = Array.isArray(value) ? value : [value];

	return (
		<label className="w-100">
			{D1.organisation}

			<Select
				unclearable
				value={publishersArray}
				options={organisationsOptions}
				placeholder=""
				multi
				onChange={(value) => {
					onChange(
						value.map((v: Option) => {
							return { id: v.value };
						})
					);
				}}
			/>
		</label>
	);
};

export default PublishersInput;
