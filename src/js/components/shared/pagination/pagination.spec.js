import React from 'react';
import { shallow } from 'enzyme';
import Pagination from './';

const items = Array.apply(null, Array(50)).map((a, i) => (
	<span key={i}>`Item ${i + 1}`</span>
));

describe('pagination', () => {
	it('renders without crashing', () => {
		shallow(
			<Pagination itemEls={items} itemsPerPage="10" context="concepts" />
		);
	});

	it('returns null because of itemsPerPage is empty', () => {
		const wrapper = shallow(
			<Pagination itemEls={items} itemsPerPage="" context="concepts" />
		);
		expect(wrapper.html()).toBeNull();
	});

	it('returns items per page', () => {
		const wrapper = shallow(
			<Pagination itemEls={items} itemsPerPage="10" context="concepts" />
		);
		expect(wrapper.find('.list-group').children()).toHaveLength(10);
	});

	it('returns empty because of context', () => {
		const wrapper = shallow(
			<Pagination itemEls={items} itemsPerPage="10" context="" />
		);
		expect(wrapper.find('.pg-rmes-concepts')).toHaveLength(0);
	});

	it('returns element thanks to context', () => {
		const wrapper = shallow(
			<Pagination itemEls={items} itemsPerPage="10" context="concepts" />
		);
		expect(wrapper.find('.pg-rmes-concepts')).toHaveLength(1);
	});

	it('returns true if init state with componentWillReceiveProps', () => {
		const wrapper = shallow(
			<Pagination itemEls={items} itemsPerPage="10" context="concepts" />
		);
		expect(wrapper.state(['currentPage'])).toBe(1);
		wrapper.setState({ currentPage: 2 });
		expect(wrapper.state(['currentPage'])).toBe(2);
		wrapper.setProps({ itemsPerPage: '5' });
		expect(wrapper.state(['currentPage'])).toBe(1);
	});

	// it('returns true if click simulation succeed', () => {
	// 	const wrapper = shallow(
	// 		<Pagination itemEls={items} itemsPerPage="10" context="concepts" />
	// 	);
	// 	const event = { e: { target: { value: '2' } } };
	// 	expect(wrapper.state(['currentPage'])).toBe(1);
	// 	wrapper
	// 		.find('.pagination')
	// 		.find('[id=2]')
	// 		.first()
	// 		.simulate('onClick', {
	// 			preventDefault: () => {},
	// 			stopPropagation: () => {},
	// 			...event,
	// 		});
	// 	expect(wrapper.state(['currentPage'])).toBe(2);
	// });

	// it('calls handleSubmit when Submit button is clicked', () => {
	// 	const wrapper = shallow(
	// 		<Pagination itemEls={items} itemsPerPage="10" context="concepts" />
	// 	);
	// 	wrapper.instance().handleClick = jest.fn();
	// 	const { handleClick } = wrapper.instance();
	// 	expect(handleClick).toHaveBeenCalledTimes(0);
	// 	wrapper.find('li[id=2]').simulate('click', {
	// 		preventDefault: () => {},
	// 		stopPropagation: () => {},
	// 		...{ target: { id: '2' } },
	// 	});
	// 	expect(handleClick).toHaveBeenCalledTimes(1);
	// });
});
