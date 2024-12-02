import { renderWithRouter } from '../../../tests-utils/render';
import Controls from './controls';

describe('classification-correspondence-association-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Controls />);
	});
});
