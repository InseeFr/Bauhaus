import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import HelpInformation from './';

describe('HelpInformation', () => {
	it('should return null if the masLabelLg1 is undefined', () => {
		const { container } = render(<HelpInformation msd={{}} />);
		expect(container).toBeEmpty();
	});
});
