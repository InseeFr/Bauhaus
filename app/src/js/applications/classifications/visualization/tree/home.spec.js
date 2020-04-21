import React from 'react';
import { render } from '@testing-library/react';
import ClassificationTree from './home';
import { MemoryRouter } from 'react-router-dom';

describe('classification-tree-home', () => {
	it('renders without crashing', () => {
		render(
			<ClassificationTree data={[]} prefLabel="prefLabel" secondLang={true} />,
			{ wrapper: MemoryRouter }
		);
	});
});
