import api from 'js/remote-api/operations-api';
import * as A from '../constants';
import { getContentDisposition } from '@inseefr/wilco/src/utils/regex';
import FileSaver from 'file-saver';

export default (id, MimeType) => dispatch => {
	var fileName = '';
	dispatch({
		type: A.EXPORT_VARBOOK,
		payload: { id, MimeType },
	});
	return api
		.getVarBookExport(id, MimeType)
		.then(
			res => {
				dispatch({ type: A.EXPORT_VARBOOK_SUCCESS });
				//we do not want to save the pdf within the reducer, so we return
				//it in order to process it later
				return res;
			},
			err => {
				throw err;
			}
		)
		.then(res => {
			fileName = getContentDisposition(
				res.headers.get('Content-Disposition')
			)[1];
			return res;
		})
		.then(res => res.blob())
		.then(blob => {
			return FileSaver.saveAs(blob, fileName);
		})
		.catch(errorMessage => {
			dispatch({ type: A.EXPORT_VARBOOK_FAILURE, payload: { errorMessage } });
		});
};
