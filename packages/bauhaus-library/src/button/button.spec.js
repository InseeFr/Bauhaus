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
			<Link className="btn bauhaus-btn btn-lg col-md-12" to="/home">
				myButton
			</Link>
		);
		expect(wrapper.contains(link)).toEqual(true);
	});

	it('contains well-formed button tag', () => {
		const onClick = () => '';
		const wrapper = shallow(<Button action={onClick} label="myButton" />);
		const button = (
			<button className="btn bauhaus-btn btn-lg col-md-12" onClick={onClick}>
				myButton
			</button>
		);
		expect(wrapper.contains(button)).toEqual(true);
	});

	it('should contain a col-md-offset CSS class if the offset prop is defined', () => {
		const wrapper = shallow(
			<Button action="/home" label="myButton" offset={2} />
		);
		const link = (
			<div className="col-md-2 col-md-offset-2">
				<Link className="btn bauhaus-btn btn-lg col-md-12" to="/home">
					myButton
				</Link>
			</div>
		);
		expect(wrapper.contains(link)).toEqual(true);
	});
	it('should not contain a col-md-offset CSS class if the offset prop is undefined', () => {
		const wrapper = shallow(<Button action="/home" label="myButton" />);
		const link = (
			<div className="col-md-2">
				<Link className="btn bauhaus-btn btn-lg col-md-12" to="/home">
					myButton
				</Link>
			</div>
		);
		expect(wrapper.contains(link)).toEqual(true);
	});
});
