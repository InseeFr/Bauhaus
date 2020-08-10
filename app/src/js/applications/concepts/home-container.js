import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Loading } from '@inseefr/wilco';
import ConceptsHome from './home';
import { NOT_LOADED } from 'js/constants';
import loadConceptList from 'js/actions/concepts/list';
import { Auth } from 'bauhaus-utilities';

const ConceptsHomeContainer = ({ concepts, permission, loadConceptList }) => {
	useEffect(() => {
		if (!concepts) {
			loadConceptList();
		}
	}, [concepts, loadConceptList]);
	if (!concepts) return <Loading />;
	return <ConceptsHome concepts={concepts} permission={permission} />;
};

const mapStateToProps = state => {
	const permission = Auth.getPermission(state);
	if (!state.conceptList) {
		return {
			status: NOT_LOADED,
			concepts: [],
		};
	}
	let { results: concepts, status, err } = state.conceptList;
	return {
		concepts,
		status,
		err,
		permission,
	};
};

const mapDispatchToProps = {
	loadConceptList,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ConceptsHomeContainer);
