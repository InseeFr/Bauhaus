import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as select from 'js/reducers';
import { EXPORT_CONCEPT_LIST } from 'js/actions/constants';
import ConceptsToExport from './home';
import { Loading } from '@inseefr/wilco';
import exportConceptList from 'js/actions/concepts/export-multi';
import loadConceptList from 'js/actions/concepts/list';
import { OK } from 'js/constants';

const ConceptsToExportContainer = ({
	concepts,
	exportStatus,
	loadConceptList,
	exportConceptList
	}) => {
	const [exportRequested, setExportRequested] = useState(false)

	useEffect(() => {
		if(!concepts){
			loadConceptList()
		}
	}, [concepts, loadConceptList]);

	const handleExportConceptList = (ids, MimeType) => {
		exportConceptList(ids, MimeType);
		setExportRequested(true);
	}

	if (exportRequested) {
		if (exportStatus === OK) {
			return <Redirect to="/concepts" />;
		}
		return <Loading textType="exporting" />;
	}

	if (!concepts) {
		return <Loading />;
	}
	return (
		<ConceptsToExport
			concepts={concepts}
			handleExportConceptList={handleExportConceptList}
		/>
	);
}
const mapStateToProps = state => ({
	concepts: select.getConceptList(state),
	exportStatus: select.getStatus(state, EXPORT_CONCEPT_LIST),
});

const mapDispatchToProps = {
	loadConceptList,
	exportConceptList,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ConceptsToExportContainer);
