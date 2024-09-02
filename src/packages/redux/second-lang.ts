import { ReduxModel } from './model';
import { useSelector } from 'react-redux';

export const SAVE_SECOND_LANG = 'SAVE_SECOND_LANG';

export const saveSecondLang = (secondLang: any) => {
	return {
		type: SAVE_SECOND_LANG,
		payload: secondLang.target.checked,
	};
};

/**
 * Redux selector that will return a boolean value.
 * true if the second lang should be displayed, false otherwise.
 * @param {*} state
 */
export function getSecondLang(state: ReduxModel) {
	return state.app?.secondLang;
}

export const useSecondLang = (): boolean => {
	return useSelector((state: ReduxModel) => getSecondLang(state) ?? false);
};
