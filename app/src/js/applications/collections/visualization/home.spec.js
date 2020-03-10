import React from 'react';
import { render } from '@testing-library/react';
import CollectionVisualization from './home';
import { empty } from 'js/utils/collections/general';
import { MemoryRouter } from 'react-router-dom';

describe('collection-visualization', () => {
	it('renders without crashing', () => {
		render(
			<CollectionVisualization
				id="id"
				general={empty()}
				members={[]}
				stampList={[]}
				validateCollection={() => console.log('validate')}
				secondLang={true}
				saveSecondLang={() => console.log('save second lang')}
				langs={{ lg1: 'fr', lg2: 'en' }}
				permission={{ authType: '', roles: [''] }}
			/>,
			{ wrapper: MemoryRouter }
		);
	});
});
