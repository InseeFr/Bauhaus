import api from 'js/remote-api/operations-api';
import * as A from 'js/actions/constants';
import { sortArray } from 'js/utils/array-utils';

const sortByLabel = sortArray('label');

export default () => dispatch => {
	dispatch({
		type: A.LOAD_OPERATIONS_DOCUMENTS,
		payload: {},
	});
	return api.getDocumentsList().then(
		results =>
			dispatch({
				type: A.LOAD_OPERATIONS_DOCUMENTS_SUCCESS,
				payload: { results: sortByLabel(results) },
			}),
		err => {
			const results = [
				{
					uri: 'uri1-bis',
					url: 'http://google.fr?q=url-1',
					updatedDate: '01/01/2019',
					lang: 'fr',
					labelLg1: 'Document 1 - label en Langue 1',
					labelLg2: 'Document 1 - label en Langue 2',
					descriptionLg1: 'Description 1 en Langue 1',
					descriptionLg2: 'Description 1 en Langue 2',
				},
				{
					uri: 'uri2-bis',
					url: 'http://google.fr?q=url-2',
					updatedDate: '01/02/2019',
					labelLg1: 'Document 2 - label en Langue 1',
					labelLg2: 'Document 2 - label en Langue 2',
					descriptionLg1: 'Description 2 en Langue 1',
					descriptionLg2: 'Description 2 en Langue 2',
				},
				{
					uri: 'uri3-bis',
					url: 'http://google.fr?q=url-2',
					labelLg1: 'Document 3 - label en Langue 1',
					labelLg2: 'Document 3 - label en Langue 2',
					descriptionLg1: 'Description 3 en Langue 1',
					descriptionLg2: 'Description 3 en Langue 2',
					lang: 'fr',
				},

				{
					uri: 'uri5-bis',
					url: 'http://google.fr?q=url-2',
					labelLg1: 'Document 5 - label en Langue 1',
					labelLg2: 'Document 5 - label en Langue 2',
					descriptionLg1: 'Description 5 en Langue 1',
					descriptionLg2: 'Description 5 en Langue 2',
					lang: 'fr',
				},
				{
					uri: 'uri4-bis',
					url: 'http://google.fr?q=url-2',
					updatedDate: '01/02/2019',
					labelLg1: 'Document 4 - label en Langue 1',
					labelLg2: 'Document 4 - label en Langue 2',
					descriptionLg1: 'Description 4 en Langue 1',
					descriptionLg2: 'Description 4 en Langue 2',
				},
			];
			dispatch({
				type: A.LOAD_OPERATIONS_DOCUMENTS_SUCCESS,
				payload: { results: sortByLabel(results) },
			});

			/*dispatch({
				type: A.LOAD_OPERATIONS_DOCUMENTS_FAILURE,
				payload: { err },
			})*/
		}
	);
};
