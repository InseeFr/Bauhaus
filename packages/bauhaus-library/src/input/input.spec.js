import React from 'react';
import { shallow } from 'enzyme';
import Input from './input';
import { ControlLabel } from 'react-bootstrap';
import Flag from '../flag';

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

	it('should display a ControlLabel component with the label', () => {
		const container = shallow(
			<Input
				id="id"
				label="label"
				placeholder="placeholder"
				value="value"
				onChange={() => 'onChange'}
			/>
		);
		expect(container.find(ControlLabel).length).toBe(1);
	});
	it('should display a ControlLabel component with the label and flag', () => {
		const container = shallow(
			<Input
				id="id"
				label="label"
				placeholder="placeholder"
				value="value"
				flag="fr"
				onChange={() => 'onChange'}
			/>
		);
		expect(container.find(ControlLabel).length).toBe(1);
		expect(container.find(Flag).length).toBe(1);
	});
	it('should not display a ControlLabel component ', () => {
		const container = shallow(
			<Input
				id="id"
				placeholder="placeholder"
				value="value"
				onChange={() => 'onChange'}
			/>
		);
		expect(container.find(ControlLabel).length).toBe(0);
	});
});
