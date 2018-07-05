import React from 'react';
import { Link } from 'react-router-dom';
import { shallow } from 'enzyme';
import Button from './';

describe('button', () => {
	it('renders without crashing', () => {
		shallow(<Button action="" label="" />);
	});

	it('contains well-formed Link tag', () => {
		const wrapper = shallow(<Button action="/home" label="myButton" />);
		const link = (
			<Link className="btn btn-concepts btn-lg col-md-12" to="/home">
				myButton
			</Link>
		);
		expect(wrapper.contains(link)).toEqual(true);
	});

	it('contains well-formed button tag', () => {
		const onClick = e => '';
		const wrapper = shallow(<Button action={onClick} label="myButton" />);
		const button = (
			<button className="btn btn-concepts btn-lg col-md-12" onClick={onClick}>
				myButton
			</button>
		);
		expect(wrapper.contains(button)).toEqual(true);
	});
});
