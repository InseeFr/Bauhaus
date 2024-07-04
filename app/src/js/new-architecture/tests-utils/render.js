import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

export const renderWithRouter = (component) => {
	return render(<MemoryRouter>{component}</MemoryRouter>);
};
