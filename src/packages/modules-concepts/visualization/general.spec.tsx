import { renderWithAppContext } from '../../tests/render';
import { empty } from '../utils/general';
import ConceptGeneralVisualization from './general';

describe('concept-visualization-general', () => {
	it('renders without crashing', () => {
		renderWithAppContext(
			<ConceptGeneralVisualization attr={empty()} secondLang={false} />,
		);
	});
});
