import React from 'react';
import { render } from '@testing-library/react';
import CollectionVisualization from './home';
import { empty } from 'js/utils/collections/general';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);
const store = mockStore({
	app: {
		secondLang: true,
	},
});

describe('collection-visualization', () => {
	it('renders without crashing', () => {
		render(
			<Provider store={store}>
				<CollectionVisualization
					id="id"
					general={empty()}
					members={[]}
					stampList={[]}
					validateCollection={() => console.log('validate')}
					secondLang={true}
					langs={{ lg1: 'fr', lg2: 'en' }}
					permission={{ authType: '', roles: [''] }}
				/>
			</Provider>,
			{ wrapper: MemoryRouter }
		);
	});
});
