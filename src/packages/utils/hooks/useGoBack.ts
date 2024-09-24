import { useLocation, useNavigate } from 'react-router-dom';

export function useGoBack() {
	const navigate = useNavigate();
	const location = useLocation();

	return function (redirectUrl: string, shouldReplace = false) {
		if (shouldReplace) {
			return navigate(redirectUrl, { replace: true });
		}
		return history.length === 1 || location.state
			? navigate(redirectUrl)
			: navigate(-1);
	};
}
