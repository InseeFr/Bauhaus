import { CL_SOURCE_CATEGORY, CL_FREQ } from '../../constants/codeList';
import * as A from '../../../actions/constants';
import { CodeListApi } from '../../../../sdk';

export const loadSetup = () => (dispatch: any) => {
	loadCodesList([CL_SOURCE_CATEGORY, CL_FREQ], dispatch);
};
export function loadCodesList(notations: any, dispatch: any) {
	notations.forEach((notation: string) => {
		return Promise.all([
			CodeListApi.getCodesList(notation),
			CodeListApi.getCodesListCodes(notation, 1, 0),
		]).then(
			([codesList, codes]) =>
				dispatch({
					type: A.LOAD_OPERATIONS_CODES_LIST_SUCCESS,
					payload: {
						codes: codes.items ?? [],
						...codesList,
					},
				}),
			(err) =>
				dispatch({
					type: A.LOAD_OPERATIONS_CODES_LIST_FAILURE,
					payload: { err },
				}),
		);
	});
}
