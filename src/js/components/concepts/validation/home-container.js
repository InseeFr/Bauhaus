import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import ConceptsToValidate from './home';
import Loading from 'js/components/shared/loading';
import { VALIDATE_CONCEPT_LIST } from 'js/actions/constants';
import * as select from 'js/reducers';
import validateConceptList from 'js/actions/concepts/validate';
import loadConceptValidateList from 'js/actions/concepts/validate-list';
import { OK } from 'js/constants';

class ConceptsToValidateContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			validationRequested: false,
		};
		this.handleValidateConceptList = ids => {
			this.props.validateConceptList(ids);
			this.setState({
				validationRequested: true,
			});
		};
	}
	componentWillMount() {
		if (!this.props.concepts) this.props.loadConceptValidateList();
	}
	render() {
		const { validationRequested } = this.state;
		const { concepts, permissions, validationStatus } = this.mapStateToProps;
		if (validationRequested) {
			if (validationStatus === OK) {
				return <Redirect to="/concepts" />;
			} else {
				return <Loading textType="validating" context="concepts" />;
			}
		}
		if (!concepts) return <Loading textType="loading" context="concepts" />;
		return (
			<ConceptsToValidate
				concepts={concepts}
				permissions={permissions}
				handleValidateConceptList={this.handleValidateConceptList}
			/>
		);
	}
}

const mapStateToProps = state => ({
	concepts: select.getConceptValidateList(state),
	permission: select.getPermission(state),
	validationStatus: select.getStatus(state, VALIDATE_CONCEPT_LIST),
});

const mapDispatchToProps = {
	loadConceptValidateList,
	validateConceptList,
};

export default connect(mapStateToProps, mapDispatchToProps)(
	ConceptsToValidateContainer
);
