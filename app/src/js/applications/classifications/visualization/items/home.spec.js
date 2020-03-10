import React from 'react';
import { render } from '@testing-library/react';
import ClassificationItems from './home';
import { MemoryRouter } from 'react-router-dom';

describe('classification-items-home', () => {
	it('renders without crashing', () => {
		render(
			<ClassificationItems
				items={[]}
				classificationId="id"
				secondLang={false}
				saveSecondLang={() => console.log('save second lang')}
			/>,
			{ wrapper: MemoryRouter }
		);
	});
});
