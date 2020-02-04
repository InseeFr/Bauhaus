import * as React from 'react';
import { mount, shallow } from 'enzyme';
import ErrorBloc from './';

jest.mock('../build-dictionary', () => ({
	errors: {
		402: () => '402 fr',
		403: ({ idConcept }) => `${idConcept} is required`,
	},
}));
describe('error-bloc', () => {
	it('renders without crashing', () => {
		const Component = () => <ErrorBloc />;
		shallow(<Component />);
	});

	it('should 	 the error', () => {
		const Component = () => <ErrorBloc error="This is an error" />;
		const wrapper = mount(<Component />);

		const alertBoc = wrapper.find('.alert');
		expect(alertBoc.get(0).props.style.visibility).toEqual('visible');
		expect(alertBoc.html()).toContain('This is an error');
	});

	it('should not display any error', () => {
		const Component = () => <ErrorBloc />;
		const wrapper = mount(<Component />);

		const alertBoc = wrapper.find('.alert');
		expect(alertBoc.get(0).props.style.visibility).toEqual('hidden');
	});
	it('should display an error from the dictionnay', () => {
		const Component = () => (
			<ErrorBloc error={'{"code": 402, "message": "this is a message"}'} />
		);
		const wrapper = mount(<Component />);

		const alertBoc = wrapper.find('.alert');
		expect(alertBoc.get(0).props.style.visibility).toEqual('visible');
		expect(alertBoc.html()).toContain('402 fr');
	});

	it('should display an error from the dictionnay with a dynamic value', () => {
		const Component = () => (
			<ErrorBloc
				error={'{"code": 403, "message": "this is a message", "idConcept": 1}'}
			/>
		);
		const wrapper = mount(<Component />);

		const alertBoc = wrapper.find('.alert');
		expect(alertBoc.get(0).props.style.visibility).toEqual('visible');
		expect(alertBoc.html()).toContain('1 is required');
	});

	it('should display an error from the dictionnay even if the code contains empty space', () => {
		const Component = () => (
			<ErrorBloc error={'{"code": 402, "message": "this is a message"}'} />
		);
		const wrapper = mount(<Component />);

		const alertBoc = wrapper.find('.alert');
		expect(alertBoc.get(0).props.style.visibility).toEqual('visible');
		expect(alertBoc.html()).toContain('402 fr');
	});
});
