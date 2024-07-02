import { render } from '@testing-library/react';
import CollectionValidation from './home';
import { MemoryRouter } from 'react-router-dom';

describe('collection-validation', () => {
	it('renders without crashing', () => {
		render(
			<CollectionValidation
				collections={[]}
				permission={{ authType: '', roles: [''] }}
				handleValidateCollectionList={jest.fn()}
			/>,
			{ wrapper: MemoryRouter }
		);
	});
});
