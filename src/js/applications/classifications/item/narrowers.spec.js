import { render } from '@testing-library/react';
import Narrowers from './narrowers';
import { MemoryRouter } from 'react-router-dom';

const narrowers = [{ id: '1', label: 'Narrower 1' }];

describe('classification-item-narrowers', () => {
	it('renders without crashing', () => {
		render(
			<Narrowers
				narrowers={narrowers}
				classificationId="id"
				secondLang={true}
			/>,
			{
				wrapper: MemoryRouter,
			}
		);
	});
});
