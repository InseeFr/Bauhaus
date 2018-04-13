import reducerItemNarrowers, { getNarrowers } from './narrowers';
import * as A from 'js/actions/constants';
import { LOADING, LOADED } from 'js/constants';

describe('reducerItemNarrowers', () => {
	test('action LOAD_CLASSIFICATION_ITEM_NARROWERS', () => {
		const action = {
			type: A.LOAD_CLASSIFICATION_ITEM_NARROWERS,
			payload: { classificationId: 'nafr2', itemId: 'B' },
		};
		const result = reducerItemNarrowers(
			{
				nafr2: {
					A: 'previous',
				},
			},
			action
		);
		expect(result).toEqual({
			nafr2: {
				A: 'previous',
				B: { status: LOADING },
			},
		});
	});
	test('action LOAD_CLASSIFICATION_ITEM_NARROWERS_SUCCESS', () => {
		const action = {
			type: A.LOAD_CLASSIFICATION_ITEM_NARROWERS_SUCCESS,
			payload: { classificationId: 'nafr2', itemId: 'B', results: [] },
		};
		const result = reducerItemNarrowers(
			{
				nafr2: {
					A: 'previous',
				},
			},
			action
		);
		expect(result).toEqual({
			nafr2: {
				A: 'previous',
				B: { status: LOADED, results: [] },
			},
		});
	});
});

describe('getNarrowers', () => {
	test('getNarrowers selector should extract nothing', () => {
		const result = getNarrowers(
			{
				nafr2: {
					A: { status: LOADED, results: 'narrowers' },
				},
			},
			'nafr2',
			'B'
		);
		expect(result).toBe();
	});
	test('getNarrowers selector should extract results', () => {
		const result = getNarrowers(
			{
				nafr2: {
					A: { status: LOADED, results: 'narrowers' },
				},
			},
			'nafr2',
			'A'
		);
		expect(result).toEqual('narrowers');
	});
});
