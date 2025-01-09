import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { Table, TableTypes } from './table';

const mockData = [
	{
		code: '001',
		labelLg1: 'Label 1',
		labelLg2: 'Étiquette 1',
		broader: 'Parent 1',
		narrower: 'Child 1',
		iri: 'iri 1',
		closeMatch: 'Close Match 1',
		actions: <button>Action 1</button>,
	},
	{
		code: '002',
		labelLg1: 'Label 2',
		labelLg2: 'Étiquette 2',
		broader: 'Parent 2',
		narrower: 'Child 2',
		iri: 'iri 2',

		closeMatch: 'Close Match 2',
		actions: <button>Action 2</button>,
	},
];

describe('Table Component', () => {
	it('renders the table with data', () => {
		render(
			<Table
				loading={false}
				codesWithActions={mockData as unknown as TableTypes['codesWithActions']}
				total={2}
				state={{ first: 0, rows: 10 }}
				onPage={vi.fn()}
			/>,
		);

		screen.getByText('Label 1');
		screen.getByText('Étiquette 1');
		screen.getByText('Parent 1');
		screen.getByText('Child 1');
		screen.getByText('Close Match 1');

		screen.getByText('Label 2');
		screen.getByText('Étiquette 2');
		screen.getByText('Parent 2');
		screen.getByText('Child 2');
		screen.getByText('Close Match 2');
	});

	it('renders loading state', () => {
		const { container } = render(
			<Table
				loading={true}
				codesWithActions={[] as unknown as TableTypes['codesWithActions']}
				total={0}
				state={{ first: 0, rows: 10 }}
				onPage={vi.fn()}
			/>,
		);

		expect(container.querySelector('.p-datatable-loading-icon')).not.toBeNull();
	});
});
