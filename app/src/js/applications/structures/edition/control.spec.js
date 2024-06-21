import { render } from '@testing-library/react';
import Controls from './controls';
import { MemoryRouter } from 'react-router-dom';

describe('<Control />', () => {
	it('renders without crashing', () => {
		render(<Controls creation={true} save={jest.fn()} />, {
			wrapper: MemoryRouter,
		});
	});
});
