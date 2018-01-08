import exportOne from './export-one';
import * as A from '../constants';

export default (ids, MimeType) => dispatch => {
	dispatch({
		type: A.EXPORT_CONCEPT_LIST,
		payload: {
			ids,
			MimeType,
		},
	});
	console.log(MimeType);
	return Promise.all(ids.map(id => dispatch(exportOne(id, MimeType)))).then(
		([...blobs]) => {
			dispatch({
				type: A.EXPORT_CONCEPT_LIST_SUCCESS,
				payload: {
					ids,
					MimeType,
					blobs,
				},
			});
			return Promise.resolve({
				ids,
				MimeType,
				blobs,
			});
		},
		err =>
			dispatch({
				type: A.EXPORT_CONCEPT_LIST_FAILURE,
				payload: {
					err,
					ids,
					MimeType,
				},
			})
	);
};
