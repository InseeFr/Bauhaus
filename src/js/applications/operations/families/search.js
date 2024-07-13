import D from '../../../i18n';
import { Link, Redirect } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../../remote-api/operations-api';

import {
	ArrayUtils,
	AdvancedSearchList,
	useTitle,
	useUrlQueryParameters,
} from '../../../utils';
import { Loading, TextInput } from '../../../new-architecture/components';

const filterLabel = ArrayUtils.filterKeyDeburr(['prefLabelLg1']);

const defaultFormState = {
	prefLabelLg1: '',
};

const SearchFormList = ({ data }) => {
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
			redirect={<Redirect to={'/operations/families'} push />}
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

const SearchListContainer = () => {
	useTitle(D.familiesTitle + ' - ' + D.operationsTitle, D.advancedSearch);
	const [data, setData] = useState();

	useEffect(() => {
		api.getAllFamiliesForAdvancedSearch().then(setData);
	}, []);

	if (!data) {
		return <Loading />;
	}
	return <SearchFormList data={data} />;
};

export default SearchListContainer;
