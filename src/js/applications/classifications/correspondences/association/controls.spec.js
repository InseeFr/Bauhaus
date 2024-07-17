import Controls from './controls';
import { renderWithRouter } from '../../../../new-architecture/tests-utils/render';

describe('classification-correspondence-association-controls', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Controls />);
	});
});
