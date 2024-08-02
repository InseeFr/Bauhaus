import { render } from '@testing-library/react';
import { DatePicker } from './';

describe('date-picker', () => {
	it('renders without crashing', () => {
		render(<DatePicker />);
	});
});
