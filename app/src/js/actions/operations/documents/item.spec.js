import { saveDocument } from './item';
import * as A from 'js/actions/constants';
import api from 'js/remote-api/api';
import { DOCUMENT, LINK } from 'js/components/operations/document/utils';

const dispatch = jest.fn();
jest.mock('js/remote-api/api');

describe('Document actions', () => {
	beforeEach(() => dispatch.mockClear());

	describe('save a document', () => {
		it('should call putDocument', async () => {
			api.putDocument = function(id) {
				return Promise.resolve('putDocument');
			};
			const document = { id: '1' };
			await saveDocument(document, DOCUMENT, [], () => {})(dispatch);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.SAVE_OPERATIONS_DOCUMENT,
				payload: { id: '1' },
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.SAVE_OPERATIONS_DOCUMENT_SUCCESS,
				payload: { id: '1' },
			});
		});
		it('should call postDocument', async () => {
			api.postDocument = function(id) {
				return Promise.resolve('postLink');
			};
			const document = { label: 'label' };
			await saveDocument(document, DOCUMENT, [], () => {})(dispatch);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.SAVE_OPERATIONS_DOCUMENT,
				payload: { label: 'label' },
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.SAVE_OPERATIONS_DOCUMENT_SUCCESS,
				payload: { id: 'postLink', label: 'label' },
			});
		});

		it('should call postLink', async () => {
			api.postLink = function(id) {
				return Promise.resolve('postLink');
			};
			const document = { label: 'label' };
			await saveDocument(document, LINK, [], () => {})(dispatch);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.SAVE_OPERATIONS_DOCUMENT,
				payload: { label: 'label' },
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.SAVE_OPERATIONS_DOCUMENT_SUCCESS,
				payload: { id: 'postLink', label: 'label' },
			});
		});

		it('should call putDocumentFile', async () => {
			api.putDocumentFile = function(id) {
				return Promise.resolve('putDocumentFile');
			};
			const document = { id: 'id', label: 'label' };
			await saveDocument(
				document,
				DOCUMENT,
				[new File(['content'], 'filename', { type: 'text/html' })],
				() => {}
			)(dispatch);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.SAVE_OPERATIONS_DOCUMENT,
				payload: { id: 'id', label: 'label' },
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.SAVE_OPERATIONS_DOCUMENT_SUCCESS,
				payload: { id: 'id', label: 'label' },
			});
		});
	});
});
