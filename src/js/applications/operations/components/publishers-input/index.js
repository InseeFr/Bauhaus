import { useSelector } from 'react-redux';
import { D1 } from '../../i18n/build-dictionary';
import * as ItemToSelectModel from '../../../../new-architecture/utils/item-to-select-model';
import { Select } from '../../../../new-architecture/components';

const PublishersInput = ({ value, onChange }) => {
	const organisations = useSelector(
		(state) => state.operationsOrganisations.results
	);
	const organisationsOptions = ItemToSelectModel.toSelectModel(organisations);

	const publishersArray = Array.isArray(value) ? value : [value];

	return (
		<label htmlFor="creator" className="w-100">
			{D1.organisation}

			<Select
				unclearable
				value={publishersArray}
				options={organisationsOptions}
				placeholder=""
				multi
				onChange={(value) => {
					onChange(
						value.map((v) => {
							return { id: v.value };
						})
					);
				}}
			/>
		</label>
	);
};

export default PublishersInput;
