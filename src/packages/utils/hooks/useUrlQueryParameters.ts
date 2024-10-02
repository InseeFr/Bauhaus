import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import DOMPurify from 'dompurify';

const computeFromUrl = (defaultValue: any) => {
	const result = z.string().url().safeParse(document.URL);
	const values = { ...defaultValue };
	if (!result.success) {
		const url = encodeURI(document.URL);
		const searchQuery = new URL(url).searchParams;

		const OBJECT_PROTOTYPE_KEY = Object.getOwnPropertyNames(Object.prototype);

		for (const key in searchQuery) {
			if (OBJECT_PROTOTYPE_KEY.includes(key)) {
				continue;
			}
			values[DOMPurify.sanitize(key)] = DOMPurify.sanitize(
				searchQuery.get(key)!,
			);
		}
	}

	return values;
};

const useUrlQueryParameters = (defaultValue: any) => {
	const navigate = useNavigate();
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
		navigate(location.pathname, { replace: true });
	};

	const setForm = (values: Record<string, string>) => {
		setSearch(values);
		const searchParams = new URLSearchParams(window.location.search);
		Object.entries(values).forEach(([key, value]) => {
			searchParams.set(key, value ?? '');
		});
		navigate(location.pathname + '?' + searchParams.toString(), {
			replace: true,
		});
	};
	return { form, setForm, reset, handleChange };
};

export default useUrlQueryParameters;
