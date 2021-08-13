import React, { useEffect } from 'react';
import { Loading } from '@inseefr/wilco';
import FamiliesHome from './home';
import loadFamiliesList from 'js/actions/operations/families/list';
import { connect } from 'react-redux';
import { NOT_LOADED, LOADED } from 'js/constants';
import { getFamilies } from 'js/reducers/index';

const FamiliesHomeContainer = ({ status, loadFamiliesList, families}) => {
	useEffect(() => {
		if(status !== LOADED){
			loadFamiliesList()
		}
	}, [status, loadFamiliesList])

	if (status !== LOADED) return <Loading />;
	return <FamiliesHome families={families} />;
}

export const mapStateToProps = state => {
	const operationsFamiliesList = getFamilies(state);
	if (!operationsFamiliesList.results) {
		return {
			status: NOT_LOADED,
			families: [],
		};
	}
	const { results: families, status, err } = operationsFamiliesList;

	return {
		families,
		status,
		err,
	};
};

const mapDispatchToProps = {
	loadFamiliesList,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FamiliesHomeContainer);
