import { useHistory } from 'react-router-dom';

export function useGoBack() {
	const history = useHistory();

	return function (redirectUrl: string, shouldReplace = false) {
		if (shouldReplace) {
			return history.replace(redirectUrl);
		}
		return history.length === 1 || history.location.state
			? history.push(redirectUrl)
			: history.goBack();
	};
}
