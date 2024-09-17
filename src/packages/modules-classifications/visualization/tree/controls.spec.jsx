import Controls from './controls';
import { renderWithRouter } from '../../../tests-utils/render';

describe('classification-tree-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Controls />);
	});
});
