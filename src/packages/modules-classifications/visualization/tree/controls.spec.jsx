import { renderWithRouter } from '../../../tests-utils/render';
import Controls from './controls';

describe('classification-tree-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Controls />);
	});
});
