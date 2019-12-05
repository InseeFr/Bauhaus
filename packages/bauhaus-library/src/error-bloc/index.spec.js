import * as React from 'react';
import { mount, shallow } from 'enzyme';
import ErrorBloc from './';
import { I18NContext } from '../context';

const value = {
	errors: {
		402: '402 fr',
	},
};
describe('error-bloc', () => {
	it('renders without crashing', () => {
		const Component = () => (
			<I18NContext.Provider value={value}>
				<ErrorBloc />
			</I18NContext.Provider>
		);
		shallow(<Component />);
	});

	it('should display the error', () => {
		const Component = () => (
			<I18NContext.Provider value={value}>
				<ErrorBloc error="This is an error" />
			</I18NContext.Provider>
		);
		const wrapper = mount(<Component />);

		const alertBoc = wrapper.find('.alert');
		expect(alertBoc.get(0).props.style.visibility).toEqual('visible');
		expect(alertBoc.html()).toContain('This is an error');
	});

	it('should not display any error', () => {
		const Component = () => (
			<I18NContext.Provider value={value}>
				<ErrorBloc />
			</I18NContext.Provider>
		);
		const wrapper = mount(<Component />);

		const alertBoc = wrapper.find('.alert');
		expect(alertBoc.get(0).props.style.visibility).toEqual('hidden');
	});
	it('should display an error from the dictionnay', () => {
		const Component = () => (
			<I18NContext.Provider value={value}>
				<ErrorBloc error={'402 : this is a message'} />
			</I18NContext.Provider>
		);
		const wrapper = mount(<Component />);

		const alertBoc = wrapper.find('.alert');
		expect(alertBoc.get(0).props.style.visibility).toEqual('visible');
		expect(alertBoc.html()).toContain('402 fr');
	});

	it('should display an error from the dictionnay even if the code contains empty space', () => {
		const Component = () => (
			<I18NContext.Provider value={value}>
				<ErrorBloc error={'      402 : this is a message'} />
			</I18NContext.Provider>
		);
		const wrapper = mount(<Component />);

		const alertBoc = wrapper.find('.alert');
		expect(alertBoc.get(0).props.style.visibility).toEqual('visible');
		expect(alertBoc.html()).toContain('402 fr');
	});
});
