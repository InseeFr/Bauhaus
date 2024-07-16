import CorrespondenceControls from './controls';
import { renderWithRouter } from '../../../../new-architecture/tests-utils/render';

describe('classification-correspondence-visualization-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(<CorrespondenceControls />);
	});
});
