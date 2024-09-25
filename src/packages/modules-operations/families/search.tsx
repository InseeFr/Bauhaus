import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import D from '../../deprecated-locales';

import useUrlQueryParameters from '../..//utils/hooks/useUrlQueryParameters';
import { AdvancedSearchList, Loading, TextInput } from '../../components';
import { FamilyAdvancedSearch } from '../../model/operations/family';
import { OperationsApi } from '../../sdk/operations-api';
import { filterKeyDeburr } from '../../utils/array-utils';
import { useTitle } from '../../utils/hooks/useTitle';

const filterLabel = filterKeyDeburr(['prefLabelLg1']);

const defaultFormState = {
	prefLabelLg1: '',
};

const SearchFormList = ({
	data,
}: Readonly<{ data: FamilyAdvancedSearch[] }>) => {
	const { form, reset, handleChange } = useUrlQueryParameters(defaultFormState);

	const { prefLabelLg1 } = form;

	const filteredData = data.filter(filterLabel(prefLabelLg1));

	const dataLinks = filteredData.map(({ id, prefLabelLg1 }) => (
		<li key={id} className="list-group-item">
			<Link to={`/operations/family/${id}`}>{prefLabelLg1}</Link>
		</li>
	));
	return (
		<AdvancedSearchList
			title={D.familiesSearchTitle}
			data={dataLinks}
			initializeState={reset}
			redirect={<Navigate to="/operations/families" />}
		>
			<div className="row form-group">
				<div className="col-md-12">
					<label className="w-100">
						{D.labelTitle}
						<TextInput
							value={prefLabelLg1}
							onChange={(e) => handleChange('prefLabelLg1', e.target.value)}
						/>
					</label>
				</div>
			</div>
		</AdvancedSearchList>
	);
};

export const Component = () => {
	useTitle(D.familiesTitle + ' - ' + D.operationsTitle, D.advancedSearch);
	const [data, setData] = useState<FamilyAdvancedSearch[]>();

	useEffect(() => {
		OperationsApi.getAllFamiliesForAdvancedSearch().then(setData);
	}, []);

	if (!data) {
		return <Loading />;
	}
	return <SearchFormList data={data} />;
};
