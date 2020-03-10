import React from 'react';
import { render } from '@testing-library/react';
import { empty } from 'js/utils/concepts/general';
import Controls, { scndWithoutFirst } from './';
import { MemoryRouter } from 'react-router-dom';

describe('concept-edition-creation-controls', () => {
	it('renders without crashing', () => {
		render(
			<Controls
				oldGeneral={empty()}
				general={empty()}
				notes={{}}
				conceptsWithLinks={[]}
				handleSave={() => console.log('validate')}
				redirectCancel={() => console.log('cancel')}
			/>,
			{ wrapper: MemoryRouter }
		);
	});
});

describe('second without first', () => {
	it('returns true if the first argument is empty but the second one is not empty', () => {
		expect(scndWithoutFirst('', 'hello')).toBe(true);
	});

	it('returns false if both arguments are empty', () => {
		expect(scndWithoutFirst('', '')).toBe(false);
	});

	it('returns false if the first argumnent is not empty and the second argument is empty', () => {
		expect(scndWithoutFirst('hello', '')).toBe(false);
	});
});
