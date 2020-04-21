export const SAVE_SECOND_LANG = 'SAVE_SECOND_LANG';

export const saveSecondLang = secondLang => {
	return {
		type: SAVE_SECOND_LANG,
		payload: secondLang.target.checked,
	};
};

export function getSecondLang(state) {
	return state.app.secondLang;
}
