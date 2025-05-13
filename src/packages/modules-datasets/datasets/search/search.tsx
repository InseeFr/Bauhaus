import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

import { AdvancedSearchList } from '@components/advanced-search/home';
import { Loading } from '@components/loading';

import { DatasetsApi } from '@sdk/datasets-api';

import { filterKeyDeburr } from '@utils/array-utils';
import { useTitle } from '@utils/hooks/useTitle';
import useUrlQueryParameters from '@utils/hooks/useUrlQueryParameters';

import D from '../../../deprecated-locales/build-dictionary';

const filterLabel = filterKeyDeburr(['labelLg1']);

const defaultFormState = {
	labelLg1: '',
	creator: '',
	disseminationStatus: '',
	validationStatus: '',
	wasGeneratedIRIs: '',
	created: '',
	updated: '',
};

export const SearchForm = () => {
	useTitle(D.datasetsTitle, D.advancedSearch);

	const [loading, setLoading] = useState(true);
	const [data, setData] = useState([]);

	useEffect(() => {
		DatasetsApi.getDatasetsForSearch()
			.then(setData)
			.finally(() => setLoading(false));
	}, []);

	const { form, reset, handleChange } = useUrlQueryParameters(defaultFormState);

	const {
		labelLg1,
		creator,
		disseminationStatus,
		validationStatus,
		wasGeneratedIRIs,
		created,
		updated,
	} = form;

	const filteredData = data.filter(filterLabel(labelLg1));

	const dataLinks = filteredData.map(({ id, labelLg1 }) => (
		<li key={id} className="list-group-item">
			<Link to={`/datasets/${id}`}>{labelLg1}</Link>
		</li>
	));

	if (loading) return <Loading />;

	return (
		<AdvancedSearchList
			title={D.datasetsSearchTitle}
			data={dataLinks}
			initializeState={reset}
			redirect={<Navigate to="/datasets" />}
		>
			<p>Hello</p>
		</AdvancedSearchList>
	);
};
