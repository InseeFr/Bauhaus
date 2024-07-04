import { useHistory, useLocation } from 'react-router-dom';
import { useState } from 'react';

const computeFromUrl = (defaultValue) => {
	const url = document.URL;
	const searchQuery = new URL(url).searchParams;

	const values = { ...defaultValue };
	for (let [key, value] of searchQuery.entries()) {
		values[key] = value;
	}
	return values;
};

export default (defaultValue) => {
	const history = useHistory();
	const location = useLocation();

	const [search, setSearch] = useState(computeFromUrl(defaultValue));

	const reset = () => {
		setSearch(defaultValue);
		history.replace(location.pathname);
	};

	const setValuesToQueryParameters = (values) => {
		setSearch(values);
		const searchParams = new URLSearchParams(window.location.search);
		Object.entries(values).forEach(([key, value]) => {
			searchParams.set(key, value ?? '');
		});
		history.replace(location.pathname + '?' + searchParams.toString());
	};
	return [search, setValuesToQueryParameters, reset];
};
