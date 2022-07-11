import { useHistory, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default (defaultValue) => {
	const history = useHistory();
	const location = useLocation();

	const [search, setSearch] = useState(defaultValue);

	const url = document.URL
	useEffect(() => {
		const searchQuery = new URL(url).searchParams;

		const values = { ...defaultValue }
		for(let [key, value] of searchQuery.entries()){
			values[key] = value;
		}
		setSearch(values)
	}, [url])

	const setValuesToQueryParameters = values => {
		const searchParams = new URLSearchParams(window.location.search);
		Object.entries(values).forEach(([key, value]) => {
			searchParams.set(key, value)
		})
		history.replace(location.pathname + "?" + searchParams.toString());
	}
	return [search, setValuesToQueryParameters]
}
