import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Loading } from '@inseefr/ui';
import ConceptsHome from './home';
import { NOT_LOADED } from 'js/constants';
import loadConceptList from 'js/actions/concepts/list';
import * as select from 'js/reducers';

class ConceptsHomeContainer extends Component {
	componentWillMount() {
		if (!this.props.concepts) {
			this.props.loadConceptList();
		}
	}

	render() {
		const { concepts, permission } = this.props;

		if (!concepts) return <Loading />;
		return <ConceptsHome concepts={concepts} permission={permission} />;
	}
}

const mapStateToProps = state => {
	const permission = select.getPermission(state);
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
