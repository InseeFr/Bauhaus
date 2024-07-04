import { useLocation } from 'react-router-dom';

export const useQueryParam = queryName => {
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	return params.get(queryName);
};
