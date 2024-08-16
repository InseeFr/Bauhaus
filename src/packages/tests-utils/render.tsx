import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

export const renderWithRouter = (component: React.ReactNode) => {
	return render(<MemoryRouter>{component}</MemoryRouter>);
};
