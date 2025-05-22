import { renderWithRouter } from '../../tests/render';
import Home from './home';

const series = [{ id: '1', label: 'Series 1' }];

describe('classification-series-home', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Home series={series} secondLang={true} />);
	});
});
