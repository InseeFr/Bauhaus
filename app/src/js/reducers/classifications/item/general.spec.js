import reducerItemGeneral, { getGeneral } from './general';
import * as A from 'js/actions/constants';
import { LOADING, LOADED } from 'js/constants';
import * as generalUtils from 'js/utils/classifications/item/general';

describe('reducerItemGeneral', () => {
	test('action LOAD_CLASSIFICATION_ITEM_GENERAL', () => {
		const action = {
			type: A.LOAD_CLASSIFICATION_ITEM_GENERAL,
			payload: { classificationId: 'nafr2', itemId: 'A' },
		};
		const result = reducerItemGeneral(
			{
				nafr2: {
					A: 'previous',
					B: 'previous',
				},
			},
			action
		);
		expect(result).toEqual({
			nafr2: {
				A: {
					status: LOADING,
				},
				B: 'previous',
			},
		});
	});
	test('action LOAD_CLASSIFICATION_ITEM_GENERAL_SUCCESS', () => {
		const action = {
			type: A.LOAD_CLASSIFICATION_ITEM_GENERAL_SUCCESS,
			payload: {
				classificationId: 'nafr2',
				itemId: 'A',
				results: { prefLabelLg1: 'Label' },
			},
		};
		const result = reducerItemGeneral(
			{
				nafr2: {
					A: 'previous',
					B: 'previous',
				},
			},
			action
		);
		expect(result).toEqual({
			nafr2: {
				A: {
					status: LOADED,
					results: Object.assign(generalUtils.empty(), {
						prefLabelLg1: 'Label',
					}),
				},
				B: 'previous',
			},
		});
	});
});

describe('getGeneral', () => {
	test('getGeneral selector should extract nothing', () => {
		const result = getGeneral(
			{
				nafr2: {
					A: { status: LOADED, results: 'data' },
				},
			},
			'nafr2',
			'B'
		);
		expect(result).toEqual();
	});
	test('getGeneral selector should extract results', () => {
		const result = getGeneral(
			{
				nafr2: {
					A: { status: LOADED, results: 'data' },
				},
			},
			'nafr2',
			'A'
		);
		expect(result).toEqual('data');
	});
});
