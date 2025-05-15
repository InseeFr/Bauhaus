import { renderWithRouter } from '../../../tests-utils/render';
import { Component } from './search';

describe('advanced search component', () => {
	it('renders without crashing', () => {
		renderWithRouter(<Component />);
	});
});
