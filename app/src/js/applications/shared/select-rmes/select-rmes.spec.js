import React from 'react';
import { render } from '@testing-library/react';
import Select from './';

const options = Array.apply(null, Array(5)).map((a, i) => ({
	value: `${i + 1}`,
	label: `Option ${i + 1}`,
}));

describe('select', () => {
	it('renders without crashing', () => {
		render(
			<Select
				value="value"
				placeholder="..."
				options={options}
				onChange={() => ''}
			/>
		);
	});
});
