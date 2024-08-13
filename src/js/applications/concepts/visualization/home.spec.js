import ConceptVisualization from './home';
import { empty } from '../../../new-architecture/modules-concepts/utils/general';
import { Provider } from 'react-redux';
import configureStore from '../../../new-architecture/redux/configure-store';
import { renderWithRouter } from '../../../new-architecture/tests-utils/render';
import { locales } from '../../../new-architecture/tests-utils/default-values';

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
					langs={locales}
					permission={{ authType: '', roles: [''] }}
				/>
			</Provider>
		);
	});
});
