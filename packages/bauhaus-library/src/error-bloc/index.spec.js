import React from 'react';
import { shallow } from 'enzyme';
import ErrorBloc from './';

describe('error-bloc', () => {
	it('renders without crashing', () => {
		shallow(<ErrorBloc action="" label="" />);
	});

	it('should display the error', () => {
		const wrapper = shallow(<ErrorBloc error="'This is an error" />);

		const alertBoc = wrapper.find('.alert');
		expect(alertBoc.get(0).props.style.visibility).toEqual('visible');
		expect(alertBoc.html()).toContain('This is an error');
	});

	it('should not display any error', () => {
		const wrapper = shallow(<ErrorBloc />);

		const alertBoc = wrapper.find('.alert');
		expect(alertBoc.get(0).props.style.visibility).toEqual('hidden');
	});
});
