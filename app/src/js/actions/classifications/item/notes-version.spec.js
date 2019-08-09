import get from './notes-version';
import * as A from 'js/actions/constants';
import api from 'js/remote-api/classifications-api';

const dispatch = jest.fn();
jest.mock('js/remote-api/classifications-api');

describe('Notes versions actions', () => {
	beforeEach(() => dispatch.mockClear());

	describe('get a notes', () => {
		it('should call dispatch LOAD_CLASSIFICATION_ITEM_NOTES_VERSION_SUCCESS action with the right notes if the status is not LOADING', async () => {
			api.getClassificationItemNotes = function(id) {
				return Promise.resolve({ 1: '1' });
			};
			const classificationId = 'classificationId';
			const itemId = 'itemId';
			const version = 'version';

			await get(classificationId, itemId, version)(dispatch);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.LOAD_CLASSIFICATION_ITEM_NOTES_VERSION,
				payload: { classificationId, itemId, version },
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.LOAD_CLASSIFICATION_ITEM_NOTES_VERSION_SUCCESS,
				payload: {
					classificationId: 'classificationId',
					itemId: 'itemId',
					results: {
						'1': '<p>1</p>',
						additionalContentNoteLg1: '',
						additionalContentNoteLg2: '',
						changeNoteLg1: '',
						changeNoteLg2: '',
						coreContentNoteLg1: '',
						coreContentNoteLg2: '',
						definitionLg1: '',
						definitionLg2: '',
						exclusionNoteLg1: '',
						exclusionNoteLg2: '',
						scopeNoteLg1: '',
						scopeNoteLg2: '',
					},
					version: 'version',
				},
			});
		});
		it('should call dispatch LOAD_CLASSIFICATION_ITEM_NOTES_VERSION_FAILURE action with the error  if the status is not LOADING', async () => {
			api.getClassificationItemNotes = function(id) {
				return Promise.reject('error');
			};
			const classificationId = 'classificationId';
			const itemId = 'itemId';
			const version = 'version';
			await get(classificationId, itemId, version)(dispatch);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.LOAD_CLASSIFICATION_ITEM_NOTES_VERSION,
				payload: { classificationId, itemId, version },
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.LOAD_CLASSIFICATION_ITEM_NOTES_VERSION_FAILURE,
				payload: { err: 'error', classificationId, itemId, version },
			});
		});
	});
});
