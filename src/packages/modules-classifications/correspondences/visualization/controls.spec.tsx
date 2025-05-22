import { renderWithRouter } from '../../../tests/render';
import CorrespondenceControls from './controls';

describe('classification-correspondence-visualization-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(<CorrespondenceControls />);
	});
});
