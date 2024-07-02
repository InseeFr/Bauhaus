import { render } from '@testing-library/react';
import Levels from './levels';
import { MemoryRouter } from 'react-router-dom';

const levels = [{ id: '1', label: 'Member 1' }];

describe('classification-series-levels', () => {
	it('renders without crashing', () => {
		render(
			<Levels
				levels={levels}
				classificationId="classification"
				secondLang={true}
			/>,
			{ wrapper: MemoryRouter }
		);
	});
});
