import React from 'react';
import { render } from '@testing-library/react';
import ClassificationItems from './home';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);
const store = mockStore({});

describe('classification-items-home', () => {
	it('renders without crashing', () => {
		render(
			<Provider store={store}>
				<ClassificationItems
					items={[]}
					classificationId="id"
					secondLang={false}
				/>
			</Provider>,
			{ wrapper: MemoryRouter }
		);
	});
});
