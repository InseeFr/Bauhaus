import { formatLeaf, updateParent, updateTree } from './';

describe('formatLeaf', () => {
	it('should return an object with an empty array for the children property', () => {
		expect(formatLeaf({ id: 1 }, 2, 3, 'baseUrl/', true)).toEqual({
			children: [{}],
			childrenFetched: false,
			id: 1,
			index: 2,
			parent: 3,
			url: 'baseUrl/1',
		});
	});
	it('should return an object with an falsy array for the children property', () => {
		expect(formatLeaf({ id: 1 }, 2, 3, 'baseUrl/', false)).toEqual({
			children: false,
			childrenFetched: false,
			id: 1,
			index: 2,
			parent: 3,
			url: 'baseUrl/1',
		});
	});
});
describe('updateParent', () => {
	it('should return the right result', () => {
		expect(
			updateParent(
				{ id: 1, url: 'url', index: 0 },
				[{ id: 2, url: 'url' }, { id: 3, url: 'url' }],
				'url/'
			)
		).toEqual({
			children: [
				{
					children: [{}],
					childrenFetched: false,
					id: 2,
					index: 0,
					parent: 0,
					url: 'url/2',
				},
				{
					children: [{}],
					childrenFetched: false,
					id: 3,
					index: 1,
					parent: 0,
					url: 'url/3',
				},
			],
			childrenFetched: true,
			expanded: true,
			id: 1,
			index: 0,
			url: 'url',
		});
	});
});
