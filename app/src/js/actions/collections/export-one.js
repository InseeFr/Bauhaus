import api from 'js/remote-api/concepts-api';
import * as A from '../constants';
import { getContentDisposition } from '@inseefr/wilco';
import FileSaver from 'file-saver';

export default (id, MimeType) => dispatch => {
	var fileName = '';
	dispatch({
		type: A.EXPORT_COLLECTION,
		payload: { id, MimeType },
	});
	return api
		.getCollectionExport(id, MimeType)
		.then(
			res => {
				dispatch({ type: A.EXPORT_COLLECTION_SUCCESS });
				//we do not want to save the pdf within the reducer, so we return
				//it in order to process it later
				return res;
			},
			err => dispatch({ type: A.EXPORT_COLLECTION_FAILURE, payload: { err } })
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
		});
};
