import React from 'react';
import { shallow } from 'enzyme';
import Input from './input';

describe('input', () => {
	it('renders without crashing', () => {
		shallow(
			<Input
				id="id"
				label="label"
				placeholder="placeholder"
				value="value"
				onChange={() => 'onChange'}
			/>
		);
	});
});
