import Home from './home';
import { renderWithAppContext } from '../../../tests-utils/render';

const series = {
	general: { prefLabelLg1: 'Label' },
	members: [{ id: '1', label: 'Member 1' }],
	notes: {
		scopeNoteLg1: 'scopeNoteLg1',
		scopeNoteLg2: 'scopeNoteLg2',
	},
};

describe('classification-series-home', () => {
	it('renders without crashing', () => {
		renderWithAppContext(<Home series={series} secondLang={true} />);
	});
});
