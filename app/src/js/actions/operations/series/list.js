import api from 'js/remote-api/operations-api';
import * as A from 'js/actions/constants';
import getListBuilder from 'js/actions/operations/utils/index';

export default () =>
	getListBuilder(
		api.getSeriesList,
		A.LOAD_OPERATIONS_SERIES_LIST,
		A.LOAD_OPERATIONS_SERIES_LIST_SUCCESS,
		A.LOAD_OPERATIONS_SERIES_LIST_FAILURE
	);
