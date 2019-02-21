import React from 'react';
import { shallow } from 'enzyme';
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
		shallow(<Flag lang="fr" />);
	});
});
