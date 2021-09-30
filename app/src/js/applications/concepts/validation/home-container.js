import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import ConceptsToValidate from './home';
import { Loading } from '@inseefr/wilco';
import { VALIDATE_CONCEPT_LIST } from 'js/actions/constants';
import * as select from 'js/reducers';
import validateConceptList from 'js/actions/concepts/validate';
import loadConceptValidateList from 'js/actions/concepts/validate-list';
import { OK } from 'js/constants';
import { Auth, useTitle } from 'bauhaus-utilities';
import D from 'js/i18n';

const ConceptsToValidateContainer = ({
		concepts, validateConceptList, loadConceptValidateList, permission, validationStatus
	}) => {

	useTitle(D.conceptsTitle, D.btnValid);
	const [validationRequested, setValidationRequested] = useState(false);

	const handleValidateConceptList = ids => {
		validateConceptList(ids);
		setValidationRequested(true)
	};

	useEffect(() => {
		if (!concepts) loadConceptValidateList();
	}, [concepts, loadConceptValidateList]);

	if (validationRequested) {
		if (validationStatus === OK) {
			return <Redirect to="/concepts" />;
		} else {
			return <Loading textType="validating" />;
		}
	}
	if (!concepts) return <Loading />;
	return (
		<ConceptsToValidate
			concepts={concepts}
			permission={permission}
			handleValidateConceptList={handleValidateConceptList}
		/>
	);
}

const mapStateToProps = state => ({
	concepts: select.getConceptValidateList(state),
	permission: Auth.getPermission(state),
	validationStatus: select.getStatus(state, VALIDATE_CONCEPT_LIST),
});

const mapDispatchToProps = {
	loadConceptValidateList,
	validateConceptList,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ConceptsToValidateContainer);
