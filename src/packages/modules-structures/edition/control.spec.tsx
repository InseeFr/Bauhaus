import Controls from './controls';
import { renderWithRouter } from '../../tests-utils/render';

describe('<Control />', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Controls creation={true} save={jest.fn()} />);
	});
});
