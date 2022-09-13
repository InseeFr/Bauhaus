import React from 'react';
import ExportCollection from './home';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

describe('collection-export', () => {
	it('renders without crashing', () => {
		render(
			<MemoryRouter>
				<ExportCollection
					collections={[]}
					handleExportCollectionList={jest.fn()}
				/>
			</MemoryRouter>
		);
	});
});
