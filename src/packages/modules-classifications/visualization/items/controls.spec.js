import Controls from './controls';
import { renderWithRouter } from '../../../tests-utils/render';

describe('classification-items-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Controls />);
	});
});
