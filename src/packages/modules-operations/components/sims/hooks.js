import { useSelector } from 'react-redux';
import { useState, useMemo } from 'react';
import { getAllOptions } from '../../../redux/geographies.action';

export const useGeographies = (territory = {}) => {
	const allGeographies = useSelector(getAllOptions);

	const [excludes, setExcludes] = useState(
		territory?.difference?.map(({ uri }) =>
			allGeographies.find(({ value }) => value === uri)
		) ?? []
	);
	const [includes, setIncludes] = useState(
		territory?.unions?.map(({ uri }) =>
			allGeographies.find(({ value }) => value === uri)
		) ?? []
	);
	const geographies = useMemo(() => {
		const includesValues = includes.map(({ value }) => value);
		const excludesValues = excludes.map(({ value }) => value);
		const values = [...includesValues, ...excludesValues];
		return allGeographies.filter(({ value }) => !values.includes(value));
	}, [includes, excludes, allGeographies]);

	return [
		geographies,
		includes,
		excludes,
		setIncludes,
		setExcludes,
		allGeographies,
	];
};
