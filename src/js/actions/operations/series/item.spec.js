import get, { saveSerie } from './item';
import * as A from 'js/actions/constants';
import api from 'js/remote-api/operations-api';

const dispatch = jest.fn();
jest.mock('js/remote-api/operations-api');

describe('Serie actions', () => {
	describe('get a serie', () => {
		it('should call dispatch LOAD_OPERATIONS_SERIE_SUCCESS action with the right serie', async () => {
			api.getSerie = function(id) {
				return Promise.resolve({ label: 'bbb' });
			};
			const id = 1;
			await get(id)(dispatch);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.LOAD_OPERATIONS_SERIE,
				payload: { id },
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.LOAD_OPERATIONS_SERIE_SUCCESS,
				payload: { id, label: 'bbb' },
			});
		});
		it('should call dispatch LOAD_OPERATIONS_SERIES_LIST_FAILURE action with the error', async () => {
			api.getSerie = function(id) {
				return Promise.reject('error');
			};
			const id = 1;
			await get(id)(dispatch);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.LOAD_OPERATIONS_SERIE,
				payload: { id },
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.LOAD_OPERATIONS_SERIES_LIST_FAILURE,
				payload: { err: 'error' },
			});
		});
	});
	describe('save a serie', () => {
		it('should call dispatch SAVE_OPERATIONS_SERIE_SUCCESS action with the udpated serie', async () => {
			const serie = { label: 'aaa' };
			await saveSerie(serie)(dispatch);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.SAVE_OPERATIONS_SERIE,
				payload: { serie },
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.SAVE_OPERATIONS_SERIE_SUCCESS,
				payload: serie,
			});
		});
	});
});
