import api from 'js/remote-api/concepts-api';
import * as A from '../constants';
import { getContentDisposition } from 'js/utils/regex';
import FileSaver from 'file-saver';

export default (id, MimeType) => dispatch => {
	var fileName = '';
	dispatch({
		type: A.EXPORT_CONCEPT,
		payload: { id, MimeType },
	});
	return (
		api
			.getConceptExport(id, MimeType)
			.then(
				res => {
					dispatch({ type: A.EXPORT_CONCEPT_SUCCESS });
					//we do not want to save the pdf within the reducer, so we return
					//it in order to process it later
					return res;
				},
				err => dispatch({ type: A.EXPORT_CONCEPT_FAILURE, payload: { err } })
			)
			//TODO Is it the best place ? We do not want to keep track of the blobs
			//within the reducer. Another option could be to define the `then`
			//handler in the component which calls the action, but it is not clean.
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
	);
};
