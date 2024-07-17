import Controls from './controls';
import { renderWithRouter } from '../../../../new-architecture/tests-utils/render';

describe('classification-items-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Controls />);
	});
});
