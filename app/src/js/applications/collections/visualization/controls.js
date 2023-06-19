import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { ActionToolbar, Button, getContentDisposition } from '@inseefr/wilco';
import check from 'js/utils/auth';
import { propTypes as permissionOverviewPropTypes } from 'js/utils/auth/permission-overview';
import D from 'js/i18n';
import ExportButtons from '../export-buttons';
import api from '../../../remote-api/concepts-collection-api';
import FileSaver from 'file-saver';

const CollectionVisualizationControls = ({
	isValidated,
	permission: { authType, roles, stamp },
	creator: collectionCreator,
	id,
	handleValidation,
	setExporting,
}) => {
	const authImpl = check(authType);
	const admin = authImpl.isAdmin(roles);
	const contributor = authImpl.isContributor(roles, stamp, collectionCreator);
	const creator = authImpl.isCollectionCreator(roles, stamp, collectionCreator);

	const validate = (
		<Button key="validate" action={handleValidation} label={D.btnValid} />
	);
	const update = (
		<Button
			key="update"
			action={`/collection/${id}/modify`}
			label={D.btnUpdate}
		/>
	);

	const btns = [];
	if (admin || creator) {
		btns.push(update);

		if (!isValidated) {
			btns.push(validate);
		}
	} else if (contributor) {
		btns.push(update);
	}

	const exportCollection = (type, withConcepts, lang = 'lg1') => {
		setExporting(true);
		let fileName;

		return api
			.getCollectionExportByType(
				id,
				'application/vnd.oasis.opendocument.text',
				type,
				lang,
				withConcepts
			)
			.then((res) => {
				fileName = getContentDisposition(
					res.headers.get('Content-Disposition')
				)[1];
				return res;
			})
			.then((res) => res.blob())
			.then((blob) => {
				return FileSaver.saveAs(blob, fileName);
			})
			.finally(() => setExporting(false));
	};

	return (
		<ActionToolbar>
			<Button action={`/collections`} label={D.btnReturn} />
			<ExportButtons exportHandler={exportCollection}></ExportButtons>
			{btns}
		</ActionToolbar>
	);
};

CollectionVisualizationControls.propTypes = {
	id: PropTypes.string.isRequired,
	permission: permissionOverviewPropTypes.isRequired,
	isValidated: PropTypes.bool.isRequired,
	handleValidation: PropTypes.func.isRequired,
};

export default withRouter(CollectionVisualizationControls);
