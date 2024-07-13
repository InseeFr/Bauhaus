import { render } from '@testing-library/react';
import { empty } from '../../../../utils/concepts/general';
import Controls from './';
import { MemoryRouter } from 'react-router-dom';

describe('concept-edition-creation-controls', () => {
	it('renders without crashing', () => {
		render(
			<Controls
				oldGeneral={empty()}
				general={empty()}
				notes={{}}
				conceptsWithLinks={[]}
				handleSave={jest.fn()}
				redirectCancel={jest.fn()}
			/>,
			{ wrapper: MemoryRouter }
		);
	});
});
