import React from 'react';
import { shallow } from 'enzyme';
import Select from './select';
import { HelpBlock } from 'react-bootstrap';

const options = Array.apply(null, Array(5)).map((a, i) => ({
	value: `${i + 1}`,
	label: `Option ${i + 1}`,
}));

describe('select', () => {
	it('renders without crashing', () => {
		shallow(
			<Select
				value="value"
				placeholder="..."
				options={options}
				onChange={() => ''}
			/>
		);
	});
	it('should display a HelpBlock if the helpMsg is defined', () => {
		const container = shallow(
			<Select
				value="value"
				placeholder="..."
				options={options}
				onChange={() => ''}
				helpMsg="helpMsg"
			/>
		);
		expect(container.find(HelpBlock).length).toBe(1);
	});
	it('should not display a HelpBlock if the helpMsg is undefined', () => {
		const container = shallow(
			<Select
				value="value"
				placeholder="..."
				options={options}
				onChange={() => ''}
			/>
		);
		expect(container.find(HelpBlock).length).toBe(0);
	});
});
