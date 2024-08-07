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

const useUrlQueryParameters = (defaultValue) => {
	const history = useHistory();
	const location = useLocation();

	const [form, setSearch] = useState(computeFromUrl(defaultValue));

	const handleChange = (property, stateChange) => {
		const newForm = {
			...form,
			[property]: stateChange,
		};
		setForm(newForm);
	};

	const reset = () => {
		setSearch(defaultValue);
		history.replace(location.pathname);
	};

	const setForm = (values) => {
		setSearch(values);
		const searchParams = new URLSearchParams(window.location.search);
		Object.entries(values).forEach(([key, value]) => {
			searchParams.set(key, value ?? '');
		});
		history.replace(location.pathname + '?' + searchParams.toString());
	};
	return { form, setForm, reset, handleChange };
};

export default useUrlQueryParameters;
