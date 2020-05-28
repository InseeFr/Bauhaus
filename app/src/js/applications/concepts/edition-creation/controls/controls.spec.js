import React from 'react';
import { render } from '@testing-library/react';
import { empty } from 'js/utils/concepts/general';
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
				handleSave={() => console.log('validate')}
				redirectCancel={() => console.log('cancel')}
			/>,
			{ wrapper: MemoryRouter }
		);
	});
});
