import Controls from './controls';
import { render } from '@testing-library/react';
import { empty } from 'js/utils/collections/general';
import { MemoryRouter } from 'react-router-dom';

describe('collection-edition-creation-controls', () => {
	it('renders without crashing', () => {
		render(
			<Controls
				general={empty()}
				collectionList={[]}
				handleSave={jest.fn()}
				redirectCancel={() => 'collections'}
			/>,
			{ wrapper: MemoryRouter }
		);
	});
});
