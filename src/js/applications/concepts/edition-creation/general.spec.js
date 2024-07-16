import { render } from '@testing-library/react';
import ConceptGeneral from './general';
import { empty } from '../../../utils/concepts/general';
import { Provider } from 'react-redux';
import configureStore from '../../../store/configure-store';

const store = configureStore({
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
