import Home from './home';
import { renderWithAppContext } from '../../../tests-utils/render';

const family = {
	general: { prefLabelLg1: 'Label' },
	members: [{ id: '1', label: 'Member 1' }],
};

describe('classification-family-home', () => {
	it('renders without crashing', () => {
		renderWithAppContext(<Home family={family} secondLang={true} />);
	});
});
