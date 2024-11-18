import { Dispatch } from 'redux';

import { CodeListApi } from '../../../../sdk';
import * as A from '../../../actions/constants';
import { CL_SOURCE_CATEGORY, CL_FREQ } from '../../constants/codeList';

export const loadSetup = () => (dispatch: Dispatch) => {
	loadCodesList([CL_SOURCE_CATEGORY, CL_FREQ], dispatch);
};
export function loadCodesList(notations: string[], dispatch: Dispatch) {
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
