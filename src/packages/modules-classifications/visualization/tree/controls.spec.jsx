import { renderWithRouter } from '../../../tests/render';
import Controls from './controls';

describe('classification-tree-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Controls />);
	});
});
