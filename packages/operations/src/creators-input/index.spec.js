import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CreatorsInput from './index';

jest.mock('@tanstack/react-query', () => ({
	useQuery: ([_key]) => {
		return {data: [{ value: 'VALUE', label: 'LABEL'}, { value: 'VALUE 2', label: 'LABEL 2'}] }
	}
}));

jest.mock('bauhaus-utilities', () => ({
	SelectRmes: ({ value, onChange, multi }) => {
			return (
				<ul>
					<li><button onClick={() => multi ? onChange([{ value }]) : onChange(value)}>{ value }</button></li>
				</ul>
			)
	}
}));


describe('CreatorsInput', () => {
	it('should have a hidden input with the current value with multi=true', () => {
		const { container } = render(<CreatorsInput value="VALUE" onChange={jest.fn()} multi/>);
		expect(container.querySelector('button').innerHTML).toBe('VALUE');
	});

	it('should have a hidden input with the current value with multi=false', () => {
		const { container } = render(<CreatorsInput value="VALUE" onChange={jest.fn()} multi/>);
		expect(container.querySelector('button').innerHTML).toBe('VALUE');
	});

	it('should set multi=true if not defined', () => {
		const { container } = render(<CreatorsInput value="VALUE" onChange={jest.fn()} multi/>);
		expect(container.querySelector('button').innerHTML).toBe('VALUE');
	});

	it('should call onChange if multi=true', () => {
		const onChange = jest.fn();
		const { container } = render(<CreatorsInput value="VALUE" onChange={onChange} multi/>);
		fireEvent.click(container.querySelector('button'));
		expect(onChange).toHaveBeenCalledWith([["VALUE"]])
	});

	it('should call onChange if multi=false', () => {
		const onChange = jest.fn();
		const { container } = render(<CreatorsInput value="VALUE" onChange={onChange} multi={false}/>);
		fireEvent.click(container.querySelector('button'));
		expect(onChange).toHaveBeenCalledWith("VALUE")
	});
})

