import { renderWithRouter } from '../../tests-utils/render';
import Controls from './controls';

describe('<Control />', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Controls creation={true} save={vi.fn()} />);
	});
});
