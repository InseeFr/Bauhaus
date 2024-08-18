import { render } from '@testing-library/react';
import { DatePicker } from './';

describe('date-picker', () => {
	it('renders without crashing', () => {
		render(<DatePicker value="2024-01-01" onChange={jest.fn()} />);
	});
});
