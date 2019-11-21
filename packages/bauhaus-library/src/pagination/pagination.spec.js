import React from 'react';
import { shallow } from 'enzyme';
import { Pagination } from './';
import { Link } from 'react-router-dom';

const items = Array.apply(null, Array(50)).map((a, i) => (
	<span key={i}>`Item ${i + 1}`</span>
));

describe('pagination', () => {
	it('renders without crashing', () => {
		shallow(<Pagination itemEls={items} itemsPerPage="10" location={{}} />);
	});

	it('returns null because of itemsPerPage is empty', () => {
		const wrapper = shallow(
			<Pagination itemEls={items} itemsPerPage="" location={{}} />
		);
		expect(wrapper.html()).toBeNull();
	});

	it('returns items per page', () => {
		const wrapper = shallow(
			<Pagination itemEls={items} itemsPerPage="10" location={{}} />
		);
		expect(wrapper.find('.list-group').children()).toHaveLength(10);
	});

	it('should enable the previous and next links if we are on the page 2', () => {
		const wrapper = shallow(
			<Pagination
				itemEls={items}
				itemsPerPage="10"
				location={{ search: '?page=2' }}
			/>
		);
		expect(wrapper.find('.disabled').length).toBe(0);
		expect(wrapper.find('a[disabled=true]').length).toBe(0);
	});
	it('should disable the previous link if we are on the page 1', () => {
		const wrapper = shallow(
			<Pagination
				itemEls={items}
				itemsPerPage="10"
				location={{ search: '?page=1' }}
			/>
		);
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
		const wrapper = shallow(
			<Pagination
				itemEls={items}
				itemsPerPage="10"
				location={{ search: '?page=5' }}
			/>
		);

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

	it('should set the right to props to the LINK', () => {
		const wrapper = shallow(
			<Pagination
				itemEls={items}
				itemsPerPage="10"
				location={{ pathname: '/pathname' }}
			/>
		);

		expect(
			wrapper
				.find(Link)
				.at(0)
				.props().to
		).toEqual('/pathname?page=1');
	});

	it('should display the first page if the page query parameter is undefined', () => {
		const wrapper = shallow(
			<Pagination itemEls={items} itemsPerPage="10" location={{}} />
		);

		expect(
			wrapper
				.find('.bauhaus-pagination li')
				.at(2)
				.hasClass('active')
		).toBeTruthy();
	});
	it('should have the right number of LI', () => {
		const wrapper = shallow(
			<Pagination
				itemEls={items}
				itemsPerPage="10"
				location={{ search: '?page=5' }}
			/>
		);

		expect(wrapper.find('.bauhaus-pagination li').length).toBe(7);
	});

	it('all links should have the aria-label attributes', () => {
		const wrapper = shallow(
			<Pagination
				itemEls={items}
				itemsPerPage="10"
				location={{ search: '?page=5' }}
			/>
		);
		wrapper.find(Link).forEach(link => {
			expect(link.props()['aria-label']).toBeDefined();
		});
	});

	it('should add aria-current=true to the active page', () => {
		const wrapper = shallow(
			<Pagination itemEls={items} itemsPerPage="10" location={{}} />
		);

		expect(
			wrapper
				.find(Link)
				.at(2)
				.props()['aria-current']
		).toBeTruthy();
		expect(
			wrapper
				.find(Link)
				.at(3)
				.props()['aria-current']
		).toBeFalsy();
	});
});
