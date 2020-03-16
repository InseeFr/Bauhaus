import React from 'react';
import { render } from '@testing-library/react';
import HelpFooter from './footer';

describe('help-footer', () => {
	it('renders without crashing', () => {
		render(<HelpFooter content={[]} selectedId="id" />);
	});
});
