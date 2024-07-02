import { render } from '@testing-library/react';
import Members from './members';
import { MemoryRouter } from 'react-router-dom';

const members = [{ id: '1', label: 'Member 1' }];

describe('classification-family-members', () => {
	it('renders without crashing', () => {
		render(<Members members={members} secondLang={true} />, {
			wrapper: MemoryRouter,
		});
	});
});
