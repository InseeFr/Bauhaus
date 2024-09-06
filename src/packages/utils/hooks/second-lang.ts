import { useAppContext } from '../../application/app-context';

export const useSecondLang = (): [boolean, () => void] => {
	const {
		secondLang: { value, toggle },
	} = useAppContext();
	return [value, toggle];
};
