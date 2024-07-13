import { render } from '@testing-library/react';
import ConceptGeneral from './general';
import { empty } from '../../../utils/concepts/general';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

const mockStore = configureStore([]);
const store = mockStore({
	disseminationStatus: {
		results: [{ url: 'url', label: 'label' }],
	},
});

describe('concept-edition-creation-general', () => {
	it('renders without crashing', () => {
		render(
			<Provider store={store}>
				<ConceptGeneral
					general={empty()}
					stampList={[]}
					handleChange={jest.fn()}
					langs={{ lg1: 'fr', lg2: 'en' }}
				/>
			</Provider>
		);
	});
});
