import get, { saveSerie } from './item';
import * as A from 'js/actions/constants';
import api from 'js/remote-api/operations-api';

const dispatch = jest.fn();
jest.mock('js/remote-api/operations-api');

describe('Serie actions', () => {
	beforeEach(() => dispatch.mockClear());

	describe('save a serie', () => {
		it('should call dispatch SAVE_OPERATIONS_SERIE_SUCCESS action with the udpated serie', async () => {
			api.putSeries = function(id) {
				return Promise.resolve('1');
			};
			const serie = { label: 'aaa', id: '1' };
			await saveSerie(serie, () => {})(dispatch);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.SAVE_OPERATIONS_SERIE,
				payload: serie,
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.SAVE_OPERATIONS_SERIE_SUCCESS,
				payload: serie,
			});
		});
	});
});
