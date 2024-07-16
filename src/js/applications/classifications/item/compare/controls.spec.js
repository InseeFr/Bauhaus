import Controls from './controls';
import { renderWithRouter } from '../../../../new-architecture/tests-utils/render';

describe('classification-item-compare-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Controls />);
	});
});
