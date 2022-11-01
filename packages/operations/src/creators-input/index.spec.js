import React from 'react';
import { render } from '@testing-library/react';
import CreatorsInput from './index';

jest.mock('@tanstack/react-query', () => ({
	useQuery: ([_key]) => {
		return {data: [{ value: 'VALUE', label: 'LABEL'}, { value: 'VALUE 2', label: 'LABEL 2'}] }
	}
}));

describe('CreatorsInput', () => {
	it('should have a hidden input with the current value', () => {
		const { container } = render(<CreatorsInput value="VALUE" onChange={jest.fn()} />);
		expect(container.querySelector('[type="hidden"]').value).toBe('VALUE');
	});
})

