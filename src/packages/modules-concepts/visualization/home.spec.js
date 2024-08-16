import ConceptVisualization from './home';
import { empty } from '../utils/general';
import { Provider } from 'react-redux';
import configureStore from '../../redux/configure-store';
import { renderWithRouter } from '../../tests-utils/render';
import { locales } from '../../tests-utils/default-values';

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
