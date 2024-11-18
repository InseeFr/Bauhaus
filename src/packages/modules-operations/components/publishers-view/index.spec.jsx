import PublishersView from './';
import { render } from '@testing-library/react';

import { vi } from 'vitest';
import * as useOrganizationsHook from '@utils/hooks/organizations';

vi.spyOn(useOrganizationsHook, 'useOrganizations').mockReturnValue({
	data: [
		{ id: 'id', label: 'label' },
		{ id: 'id2', label: 'label2' },
	],
});

describe('<PublishersView />', () => {
	it('should return a paragraph of item if the publishers is an object', () => {
		const publishers = {
			id: 'id',
		};
		const { container } = render(<PublishersView publishers={publishers} />);
		expect(container.querySelector('p').innerHTML).toBe('label');
	});
	it('should return a list of two items if the publishers is an array', () => {
		const publishers = [
			{
				id: 'id',
			},
			{
				id: 'id2',
			},
		];
		const { container } = render(<PublishersView publishers={publishers} />);
		expect(container.querySelector('li:nth-child(1)').innerHTML).toBe('label');
		expect(container.querySelector('li:nth-child(2)').innerHTML).toBe('label2');
	});
});
