import React from 'react';
import { render } from '@testing-library/react';
import Flag, { isFlag } from './flag';

describe('isFlag', () => {
	it('missing img returns false', () => {
		expect(isFlag('de')).toBe(false);
	});

	it('existing img returns true', () => {
		expect(isFlag('fr')).toBe(true);
	});
});

describe('flag', () => {
	it('renders without crashing', () => {
		render(<Flag lang="fr" />);
	});
});
