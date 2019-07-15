import get, { saveIndicator } from './item';
import * as A from 'js/actions/constants';
import api from 'js/remote-api/operations-api';

const dispatch = jest.fn();
jest.mock('js/remote-api/operations-api');

describe('Indicators actions', () => {
	beforeEach(() => dispatch.mockClear());

	describe('save an indicator', () => {
		it('should call dispatch SAVE_OPERATIONS_INDICATOR_SUCCESS action with the udpated operation', async () => {
			api.putIndicator = function() {
				return Promise.resolve('');
			};

			const indicator = { id: '1', altLabelLg1: 'aaa', prefLabelLg1: 'aaa' };
			await saveIndicator(indicator, () => {})(dispatch);
			expect(dispatch).toHaveBeenCalledWith({
				type: A.SAVE_OPERATIONS_INDICATOR,
				payload: { altLabelLg1: 'aaa', id: '1', prefLabelLg1: 'aaa' },
			});
			expect(dispatch).toHaveBeenLastCalledWith({
				type: A.SAVE_OPERATIONS_INDICATOR_SUCCESS,
				payload: { altLabel: 'aaa', id: '', prefLabelLg1: 'aaa' },
			});
		});
	});
});
