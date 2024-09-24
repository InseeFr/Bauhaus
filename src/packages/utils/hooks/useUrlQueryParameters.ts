import { useHistory, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { z } from 'zod';

const computeFromUrl = (defaultValue: any) => {
	const result = z.string().url().safeParse(document.URL);
	const values = { ...defaultValue };
	if (!result.success) {
		const url = encodeURI(document.URL);
		const searchQuery = new URL(url).searchParams;

		//@ts-ignore
		for (const [key, value] of searchQuery.entries()) {
			values[key] = value;
		}
	}

	return values;
};

const useUrlQueryParameters = (defaultValue: any) => {
	const history = useHistory();
	const location = useLocation();

	const [form, setSearch] = useState(computeFromUrl(defaultValue));
	const handleChange = (property: string, stateChange: string) => {
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

	const setForm = (values: Record<string, string>) => {
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
