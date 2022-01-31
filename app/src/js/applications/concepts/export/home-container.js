import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as select from 'js/reducers';
import { EXPORT_CONCEPT_LIST } from 'js/actions/constants';
import ConceptsToExport from './home';
import { Loading } from '@inseefr/wilco';
import exportConceptList from 'js/actions/concepts/export-multi';
import { OK } from 'js/constants';
import { ArrayUtils, useTitle } from 'bauhaus-utilities';
import D from 'js/i18n';
import api from '../../../remote-api/concepts-api';

const ConceptsToExportContainer = ({
	exportStatus,
	exportConceptList
	}) => {

	useTitle(D.conceptsTitle, D.exportTitle)
	const [exportRequested, setExportRequested] = useState(false)
	const [concepts, setConcepts] = useState([])
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		api.getConceptList().then(results => {
			setConcepts(ArrayUtils.sortArrayByLabel(results));
		}).finally(() => setLoading(false))
	}, [])

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

	if (loading) {
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
	exportStatus: select.getStatus(state, EXPORT_CONCEPT_LIST),
});

const mapDispatchToProps = {
	exportConceptList,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ConceptsToExportContainer);
