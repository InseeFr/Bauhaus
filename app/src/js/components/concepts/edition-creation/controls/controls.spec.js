import React from 'react';
import { shallow } from 'enzyme';
import { empty } from 'js/utils/concepts/general';
import Controls, { scndWithoutFirst } from './';

describe('concept-edition-creation-controls', () => {
	it('renders without crashing', () => {
		shallow(
			<Controls
				oldGeneral={empty()}
				general={empty()}
				notes={{}}
				conceptsWithLinks={[]}
				handleSave={() => console.log('validate')}
				redirectCancel={() => console.log('cancel')}
			/>
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
