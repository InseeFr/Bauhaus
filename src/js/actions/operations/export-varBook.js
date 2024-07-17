import api from '../../remote-api/operations-api';
import * as A from '../constants';
import { saveFileFromHttpResponse } from '../../new-architecture/utils/files';

const exportVarbook = (id, MimeType) => (dispatch) => {
	dispatch({
		type: A.EXPORT_VARBOOK,
		payload: { id, MimeType },
	});
	return api
		.getVarBookExport(id, MimeType)
		.then(
			(res) => {
				dispatch({ type: A.EXPORT_VARBOOK_SUCCESS });
				//we do not want to save the pdf within the reducer, so we return
				//it in order to process it later
				return res;
			},
			(err) => {
				throw err;
			}
		)
		.then(saveFileFromHttpResponse)
		.catch((errorMessage) => {
			dispatch({ type: A.EXPORT_VARBOOK_FAILURE, payload: { errorMessage } });
		});
};

export default exportVarbook;
