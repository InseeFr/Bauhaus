import { useAppContext } from '../../application/app-context';

export const useSecondLang = (): [boolean, VoidFunction] => {
	const {
		secondLang: { value, toggle },
	} = useAppContext();
	return [value, toggle];
};
