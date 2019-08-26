import api from 'js/remote-api/operations-api';
import * as A from 'js/actions/constants';
import getListBuilder from 'js/actions/operations/utils/index';

export default () =>
	getListBuilder(
		api.getOperationsList,
		A.LOAD_OPERATIONS_OPERATIONS_LIST,
		A.LOAD_OPERATIONS_OPERATIONS_LIST_SUCCESS,
		A.LOAD_OPERATIONS_OPERATIONS_LIST_FAILURE
	);
