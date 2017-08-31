import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loading-overlay';
import ConceptsHome from './home';
import { dictionary } from 'js/utils/dictionary';
import { NOT_LOADED } from 'js/constants';
import loadConceptList from 'js/actions/concepts/list';

class ConceptsHomeContainer extends Component {
	componentWillMount() {
		if (!this.props.conceptList) {
			this.props.loadConceptList();
		}
	}

	render() {
		const { concepts } = this.props;

		if (!concepts) {
			return (
				<div>
					<Loadable
						active={true}
						spinner
						text={dictionary.loadable.loading}
						color="#457DBB"
						background="grey"
						spinnerSize="400px"
					/>
				</div>
			);
		}
		return <ConceptsHome concepts={concepts} />;
	}
}

const mapStateToProps = state => {
	if (!state.conceptList) {
		return {
			status: NOT_LOADED,
			concepts: [],
		};
	}
	//TODO should be sorted in the state, shouldn't they ?
	let { results: concepts, status, err } = state.conceptList;

	return {
		concepts,
		status,
		err,
	};
};

const mapDispatchToProps = {
	loadConceptList,
};

export default connect(mapStateToProps, mapDispatchToProps)(
	ConceptsHomeContainer
);
