import { render } from '@testing-library/react';
import Home from './home';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);
const store = mockStore({
	app: {
		secondLang: true,
	},
});

const family = {
	general: { prefLabelLg1: 'Label' },
	members: [{ id: '1', label: 'Member 1' }],
};

describe('classification-family-home', () => {
	it('renders without crashing', () => {
		render(
			<Provider store={store}>
				<Home family={family} secondLang={true} />
			</Provider>,
			{
				wrapper: MemoryRouter,
			}
		);
	});
});
