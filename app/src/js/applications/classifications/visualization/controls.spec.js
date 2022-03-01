import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Controls from './controls';

const store = mockStore({
	app: {
		secondLang: true,
	},
});

describe('classification-visualization-controls', () => {
	it('renders without crashing', () => {
		render(
			<Provider store={store}>
				<Controls
					classification={{}}
					publish={() => {}}
					permission={{ authType: '', roles: [''] }}
				/>
			</Provider>,
			{
				wrapper: MemoryRouter,
			}
		);
	});
});
