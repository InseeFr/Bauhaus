import Controls from './controls';
import { renderWithRouter } from '../../../tests-utils/render';

describe('classification-correspondence-association-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Controls />);
	});
});
