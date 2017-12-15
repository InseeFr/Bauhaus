import * as A from 'js/actions/constants';

export const saveSecondLang = secondLang => {
	return {
		type: A.SAVE_SECOND_LANG,
		payload: secondLang.target.checked,
	};
};
