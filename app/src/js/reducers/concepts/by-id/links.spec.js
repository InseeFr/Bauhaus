import reducerConceptsLinks, { getLinks } from './links';
import * as A from 'js/actions/constants';
import { LOADED } from 'js/constants';

describe('reducerConceptsLinks', () => {
	test('action LOAD_CONCEPT_LINKS_SUCCESS', () => {
		const action = {
			type: A.LOAD_CONCEPT_LINKS_SUCCESS,
			payload: { id: 'id1', results: 'links' },
		};
		const result = reducerConceptsLinks(
			{ id1: 'previous', id2: 'previous' },
			action
		);
		expect(result).toEqual({
			id1: {
				status: LOADED,
				results: 'links',
			},
			id2: 'previous',
		});
	});
});

describe('getLinks', () => {
	test('getLinks selector should extract nothing', () => {
		const result = getLinks({ id1: { results: 'links' } }, 'id2');
		expect(result).toEqual();
	});
	test('getLinks selector should extract results', () => {
		const result = getLinks({ id1: { results: 'links' } }, 'id1');
		expect(result).toEqual('links');
	});
});
