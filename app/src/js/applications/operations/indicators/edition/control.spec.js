import React from 'react';
import { mount } from 'enzyme';
import Control from './control';
import { BrowserRouter as Router } from 'react-router-dom';
import { I18NContext } from '@inseefr/ui';

const value = {
	errors: {
		402: '402 fr',
	},
};
const onSubmit = () => {};
describe('Control', () => {
	it('should have a button to the indicator page', () => {
		const indicator = { id: '1' };
		const general = mount(
			<I18NContext.Provider value={value}>
				<Router>
					<Control indicator={indicator} onSubmit={onSubmit} />
				</Router>
			</I18NContext.Provider>
		);
		expect(
			general
				.render()
				.find('a')
				.first()
				.prop('href')
		).toBe('/operations/indicator/1');
	});
	it('should have a button to the indicators page', () => {
		const indicator = {};
		const general = mount(
			<I18NContext.Provider value={value}>
				<Router>
					<Control indicator={indicator} onSubmit={onSubmit} />
				</Router>
			</I18NContext.Provider>
		);
		expect(
			general
				.render()
				.find('a')
				.first()
				.prop('href')
		).toBe('/operations/indicators');
	});
	it('should display an error message', () => {
		const indicator = {};
		const general = mount(
			<I18NContext.Provider value={value}>
				<Router>
					<Control
						indicator={indicator}
						onSubmit={onSubmit}
						errorMessage="The title is required"
					/>
				</Router>
			</I18NContext.Provider>
		).render();
		expect(
			general
				.find('.alert-danger')
				.first()
				.prop('style').visibility
		).toBe('visible');

		expect(
			general
				.find('.alert-danger')
				.first()
				.text()
		).toBe('The title is required');

		expect(
			general
				.find('button')
				.first()
				.prop('disabled')
		).toBeTruthy();
	});
	it('should not display an error message', () => {
		const indicator = {
			prefLabelLg1: 'prefLabelLg1',
			prefLabelLg2: 'prefLabelLg2',
		};
		const general = mount(
			<I18NContext.Provider value={value}>
				<Router>
					<Control indicator={indicator} onSubmit={onSubmit} />
				</Router>
			</I18NContext.Provider>
		).render();
		expect(
			general
				.find('.alert-danger')
				.first()
				.prop('style').visibility
		).toBe('hidden');

		expect(
			general
				.find('.alert-danger')
				.first()
				.text()
		).toBe(' ');

		expect(
			general
				.find('button')
				.first()
				.prop('disabled')
		).toBeFalsy();
	});
});
