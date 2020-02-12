import React from 'react';
import { shallow } from 'enzyme';
import { NOT_LOADED, LOADED } from 'js/constants';
import { Loading } from '@inseefr/wilco';

import FamiliesHome from './home';

import { mapStateToProps, FamiliesHomeContainer } from './index';

describe('FamiliesHomeContainer', () => {
	it('should display a LOADING component if the status is not LOADED', () => {
		const general = shallow(
			<FamiliesHomeContainer loadFamiliesList={jest.fn()} status={NOT_LOADED} />
		);
		expect(general.find(Loading).length).toBe(1);
		expect(general.find(FamiliesHome).length).toBe(0);
	});
	it('should display a FamiliesHome component if the status is  LOADED', () => {
		const general = shallow(
			<FamiliesHomeContainer loadFamiliesList={jest.fn()} status={LOADED} />
		);
		expect(general.find(Loading).length).toBe(0);
		expect(general.find(FamiliesHome).length).toBe(1);
	});
	it('should return NOT_LOADED status if the data is not available', () => {
		const result = mapStateToProps({});
		expect(result).toEqual({ families: [], status: NOT_LOADED });
	});
	it('should return families if available', () => {
		const result = mapStateToProps({
			operationsFamiliesList: {
				results: ['results'],
				status: LOADED,
				err: 'err',
			},
		});
		expect(result).toEqual({
			families: ['results'],
			status: LOADED,
			err: 'err',
		});
	});
});
