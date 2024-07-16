import ConceptEditionCreation from './home';
import { empty } from '../../../utils/concepts/general';
import { Provider } from 'react-redux';
import configureStore from '../../../store/configure-store';
import { renderWithRouter } from '../../../new-architecture/tests-utils/render';

const store = configureStore({
	disseminationStatus: {
		results: [{ url: 'url', label: 'label' }],
	},
});

describe('concept-edition-creation', () => {
	it('renders without crashing', () => {
		renderWithRouter(
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
		);
	});
});
