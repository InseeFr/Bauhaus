import { render } from '@testing-library/react';

import { CreatorsView } from './';
import * as stampsHooks from '../../../utils/hooks/stamps';

describe('<CreatorsView />', () => {
	beforeEach(() => {
		// Mock useV2StampsMap to return a Map with test data
		vi.spyOn(stampsHooks, 'useV2StampsMap').mockReturnValue(
			new Map([
				['DG75-L201', 'INSEE'],
				['DG75-L202', 'DARES'],
				['id', 'Label for id'],
				['id2', 'Label for id2'],
			])
		);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should return a paragraph with the label if the creator is a string', () => {
		const creators = 'id';
		const { container } = render(<CreatorsView creators={creators} />);
		expect(container.querySelector('p')!.innerHTML).toBe('Label for id');
	});

	it('should return a list of two items with labels if the creators is an array', () => {
		const creators = ['id', 'id2'];
		const { container } = render(<CreatorsView creators={creators} />);
		expect(container.querySelector('li:nth-child(1)')!.innerHTML).toBe(
			'Label for id'
		);
		expect(container.querySelector('li:nth-child(2)')!.innerHTML).toBe(
			'Label for id2'
		);
	});

	it('should use List component with proper getContent for label mapping', () => {
		const creators = ['DG75-L201', 'DG75-L202'];
		const { container } = render(<CreatorsView creators={creators} />);

		const listItems = container.querySelectorAll('li');
		expect(listItems).toHaveLength(2);
		expect(listItems[0].textContent).toBe('INSEE');
		expect(listItems[1].textContent).toBe('DARES');
	});

	it('should pass correct type parameter to List component', () => {
		const creators = ['id', 'id2', 'DG75-L201'];
		const { container } = render(<CreatorsView creators={creators} />);

		const ul = container.querySelector('ul');
		expect(ul).toBeTruthy();

		const listItems = container.querySelectorAll('li');
		expect(listItems).toHaveLength(3);
		expect(listItems[0].textContent).toBe('Label for id');
		expect(listItems[1].textContent).toBe('Label for id2');
		expect(listItems[2].textContent).toBe('INSEE');
	});

	it('should fallback to value when label is not found in the map', () => {
		const creators = 'unknown-id';
		const { container } = render(<CreatorsView creators={creators} />);
		expect(container.querySelector('p')!.innerHTML).toBe('unknown-id');
	});

	it('should handle empty creators prop', () => {
		const { container } = render(<CreatorsView creators={undefined} />);
		const paragraph = container.querySelector('p');
		expect(paragraph).toBeTruthy();
		expect(paragraph!.innerHTML).toBe('');
	});

	it('should handle empty array', () => {
		const creators: string[] = [];
		const { container } = render(<CreatorsView creators={creators} />);
		const paragraph = container.querySelector('p');
		expect(paragraph).toBeTruthy();
		expect(paragraph!.innerHTML).toBe('');
	});
});
