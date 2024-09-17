import CorrespondenceControls from './controls';
import { renderWithRouter } from '../../../tests-utils/render';

describe('classification-correspondence-visualization-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(<CorrespondenceControls />);
	});
});
