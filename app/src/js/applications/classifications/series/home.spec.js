import React from 'react';
import { render } from '@testing-library/react';
import Home from './home';
import { MemoryRouter } from 'react-router-dom';
const series = [{ id: '1', label: 'Series 1' }];

describe('classification-series-home', () => {
	it('renders without crashing', () => {
		render(
			<Home
				series={series}
				secondLang={true}
				saveSecondLang={() => console.log('save second lang')}
			/>,
			{ wrapper: MemoryRouter }
		);
	});
});
