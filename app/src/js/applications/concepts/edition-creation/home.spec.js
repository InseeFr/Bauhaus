import { render } from '@testing-library/react';
import ConceptEditionCreation from './home';
import { empty } from 'js/utils/concepts/general';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

const mockStore = configureStore([]);
const store = mockStore({
	disseminationStatus: {
		results: [{ url: 'url', label: 'label' }],
	},
});

describe('concept-edition-creation', () => {
	it('renders without crashing', () => {
		render(
			<MemoryRouter>
				<Provider store={store}>
					<ConceptEditionCreation
						id="id"
						creation={true}
						title="title"
						general={empty()}
						notes={{}}
						conceptsWithLinks={[]}
						stampList={[]}
						save={jest.fn()}
						langs={{ lg1: 'fr', lg2: 'en' }}
					/>
				</Provider>
			</MemoryRouter>
		);
	});
});
