import { handleReset } from './reset-reducer';

describe('handleReset', () => {
	const state = { state: 'previous' };
	const defaultReducer = (state, action) => state;
	const actions = ['XXX', 'YYY'];
	const resetReducer = handleReset(defaultReducer, actions);
	test('handleReset should return reducer with undefined state', () => {
		const action = { type: 'XXX', payload: {} };
		expect(resetReducer(state, action)).toEqual(
			defaultReducer(undefined, action)
		);
	});

	test('handleReset should return reducer with state', () => {
		const action = { type: 'ZZZ', payload: {} };
		expect(resetReducer(state, action)).toEqual(defaultReducer(state, action));
	});
});
