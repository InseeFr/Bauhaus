import React from 'react';
import { shallow } from 'enzyme';
import Pagination from './';

const items = Array.apply(null, Array(50)).map((a, i) => (
	<span key={i}>`Item ${i + 1}`</span>
));

const e = {
	preventDefault: () => {},
};
describe('pagination', () => {
	it('renders without crashing', () => {
		shallow(<Pagination itemEls={items} itemsPerPage="10" />);
	});

	it('returns null because of itemsPerPage is empty', () => {
		const wrapper = shallow(<Pagination itemEls={items} itemsPerPage="" />);
		expect(wrapper.html()).toBeNull();
	});

	it('returns items per page', () => {
		const wrapper = shallow(<Pagination itemEls={items} itemsPerPage="10" />);
		expect(wrapper.find('.list-group').children()).toHaveLength(10);
	});

	it('returns true if init state with componentWillReceiveProps', () => {
		const wrapper = shallow(<Pagination itemEls={items} itemsPerPage="10" />);
		expect(wrapper.state(['currentPage'])).toBe(1);
		wrapper.setState({ currentPage: 2 });
		expect(wrapper.state(['currentPage'])).toBe(2);
		wrapper.setProps({ itemsPerPage: '5' });
		expect(wrapper.state(['currentPage'])).toBe(2);
	});

	it('return the right currentPage when we click to the page 2', () => {
		const wrapper = shallow(<Pagination itemEls={items} itemsPerPage="10" />);
		expect(wrapper.state(['currentPage'])).toBe(1);
		wrapper
			.findWhere(node => node.key() === '2')
			.find('button')
			.first()
			.simulate('click', e);
		expect(wrapper.state(['currentPage'])).toBe(2);
	});

	it('return the right currentPage when we click to the previous page', () => {
		const wrapper = shallow(<Pagination itemEls={items} itemsPerPage="10" />);
		wrapper.setState({ currentPage: 2 });

		wrapper
			.find('button')
			.at(1)
			.simulate('click', e);

		expect(wrapper.state(['currentPage'])).toBe(1);
	});
	it('return the right currentPage when we click to the next page', () => {
		const wrapper = shallow(<Pagination itemEls={items} itemsPerPage="10" />);
		wrapper.setState({ currentPage: 2 });

		wrapper
			.find('button')
			.at(6)
			.simulate('click', e);
		expect(wrapper.state(['currentPage'])).toBe(3);
	});

	it('return the right currentPage when we click to the first page', () => {
		const wrapper = shallow(<Pagination itemEls={items} itemsPerPage="10" />);
		expect(wrapper.state(['currentPage'])).toBe(1);
		wrapper
			.find('button')
			.first()
			.simulate('click', e);
		expect(wrapper.state(['currentPage'])).toBe(1);
	});
	it('return the right currentPage when we click to the last page', () => {
		const wrapper = shallow(<Pagination itemEls={items} itemsPerPage="10" />);
		expect(wrapper.state(['currentPage'])).toBe(1);
		wrapper
			.find('button')
			.last()
			.simulate('click', e);
		expect(wrapper.state(['currentPage'])).toBe(5);
	});

	it('should enable the previous and next links if we are on the page 2', () => {
		const wrapper = shallow(<Pagination itemEls={items} itemsPerPage="10" />);
		wrapper.setState({ currentPage: 2 });
		expect(wrapper.find('.disabled').length).toBe(0);
		expect(wrapper.find('button[disabled=true]').length).toBe(0);
	});
	it('should disable the previous link if we are on the page 1', () => {
		const wrapper = shallow(<Pagination itemEls={items} itemsPerPage="10" />);
		wrapper.setState({ currentPage: 1 });
		expect(
			wrapper
				.find('li')
				.at(1)
				.hasClass('disabled')
		).toBeTruthy();

		expect(
			wrapper
				.find('li')
				.at(0)
				.hasClass('disabled')
		).toBeTruthy();
	});

	it('should disable the next link if we are on the last page', () => {
		const wrapper = shallow(<Pagination itemEls={items} itemsPerPage="10" />);
		wrapper.setState({ currentPage: 5 });

		expect(
			wrapper
				.find('li')
				.at(5)
				.hasClass('disabled')
		).toBeTruthy();
		expect(
			wrapper
				.find('li')
				.at(6)
				.hasClass('disabled')
		).toBeTruthy();
	});
});
