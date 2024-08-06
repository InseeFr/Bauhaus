import ConceptVisualization from './home';
import { empty } from '../../../utils/concepts/general';
import { Provider } from 'react-redux';
import configureStore from '../../../new-architecture/redux/configure-store';
import { renderWithRouter } from '../../../new-architecture/tests-utils/render';

const store = configureStore({
	app: {
		secondLang: true,
	},
});

describe('concept-visualization', () => {
	it('renders without crashing', () => {
		renderWithRouter(
			<Provider store={store}>
				<ConceptVisualization
					id="id"
					general={empty()}
					notes={{}}
					links={[]}
					stampList={[]}
					disseminationStatusList={[]}
					validateConcept={jest.fn()}
					secondLang={true}
					langs={{ lg1: 'fr', lg2: 'en' }}
					permission={{ authType: '', roles: [''] }}
				/>
			</Provider>
		);
	});
});
