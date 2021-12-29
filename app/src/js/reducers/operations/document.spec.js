import { operationsDocuments, operationsCurrentDocument } from './documents';
import { LOADED, LOADING, ERROR } from 'js/constants';
import {
	LOAD_OPERATIONS_DOCUMENTS,
	LOAD_OPERATIONS_DOCUMENTS_SUCCESS,
	LOAD_OPERATIONS_DOCUMENTS_FAILURE,
	LOAD_OPERATIONS_DOCUMENT,
	LOAD_OPERATIONS_DOCUMENT_SUCCESS,
	LOAD_OPERATIONS_DOCUMENT_FAILURE,
	SAVE_OPERATIONS_DOCUMENT_SUCCESS,
} from 'js/actions/constants/operations/documents';

describe('operationsCurrentDocument', () => {
	it('should return LOADING', () => {
		const state = {};
		const action = {
			type: LOAD_OPERATIONS_DOCUMENT,
		};
		const output = operationsCurrentDocument(state, action);

		expect(output).toEqual({ status: LOADING });
	});
	it('should return LOADED', () => {
		const state = {};
		const action = {
			type: LOAD_OPERATIONS_DOCUMENT_SUCCESS,
			payload: 'payload',
		};
		const output = operationsCurrentDocument(state, action);

		expect(output).toEqual({ status: LOADED, results: 'payload' });
	});
	it('should return ERROR', () => {
		const state = {};
		const action = {
			type: LOAD_OPERATIONS_DOCUMENT_FAILURE,
			payload: {
				err: 'err',
			},
		};
		const output = operationsCurrentDocument(state, action);

		expect(output).toEqual({ status: ERROR, err: 'err' });
	});
	it('should return an empty object', () => {
		const state = {};
		const action = {
			type: SAVE_OPERATIONS_DOCUMENT_SUCCESS,
		};
		const output = operationsCurrentDocument(state, action);

		expect(output).toEqual({});
	});
});
