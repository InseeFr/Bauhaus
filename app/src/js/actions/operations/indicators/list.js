import api from 'js/remote-api/operations-api';
import * as A from 'js/actions/constants';
import getListBuilder from 'js/actions/operations/utils/index';

export default () =>
	getListBuilder(
		api.getIndicatorsList,
		A.LOAD_OPERATIONS_INDICATORS_LIST,
		A.LOAD_OPERATIONS_INDICATORS_LIST_SUCCESS,
		A.LOAD_OPERATIONS_INDICATORS_LIST_FAILURE
	);
