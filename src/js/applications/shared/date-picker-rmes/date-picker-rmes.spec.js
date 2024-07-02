import { render } from '@testing-library/react';
import DatePickerRmes from './';

describe('date-picker', () => {
	it('renders without crashing', () => {
		render(<DatePickerRmes />);
	});
});
