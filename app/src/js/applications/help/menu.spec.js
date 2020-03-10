import React from 'react';
import { render } from '@testing-library/react';
import HelpMenu from './menu';

describe('help-menu', () => {
	it('renders without crashing', () => {
		render(<HelpMenu content={[]} selectedId="id" />);
	});
});
