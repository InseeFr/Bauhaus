import { renderWithRouter } from '../../../tests-utils/render';
import Controls from './controls';

describe('classification-items-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Controls />);
	});
});
