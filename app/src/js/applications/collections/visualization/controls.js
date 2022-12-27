import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { ActionToolbar, Button, getContentDisposition } from '@inseefr/wilco';
import check from 'js/utils/auth';
import { propTypes as permissionOverviewPropTypes } from 'js/utils/auth/permission-overview';
import D from 'js/i18n';
import api from '../../../remote-api/concepts-api';
import FileSaver from 'file-saver';
import { CollectionExportModal } from '../modal';

const CollectionVisualizationControls = ({
		 isValidated,
		 permission: { authType, roles, stamp },
		 creator: collectionCreator,
		 id,
		 handleValidation,
	 }) => {

	const [displayModal, setDisplayModal] = useState(false);

	const authImpl = check(authType);
	const admin = authImpl.isAdmin(roles);
	const contributor = authImpl.isContributor(roles, stamp, collectionCreator);
	const creator = authImpl.isCollectionCreator(
		roles,
		stamp,
		collectionCreator,
	);


	const exportConcept = [() => setDisplayModal(true), D.btnExporter];
	const cancel = [`/collections`, D.btnReturn];
	const validate = [handleValidation, D.btnValid];
	const update = [`/collection/${id}/modify`, D.btnUpdate];

	const btns = [cancel, exportConcept]
	if (admin || creator) {
		btns.push(update);

		if(!isValidated){
			btns.push(validate)
		}
	} else if (contributor) {
		btns.push(update);
	}

	const handleExportCollectionList = type => {
		return (ids, MimeType, lang = "lg1") => {
			const promise = api.getCollectionExportByType(ids[0], MimeType, type, lang);
			let fileName;
			return promise.then(res => {
				fileName = getContentDisposition(
					res.headers.get('Content-Disposition')
				)[1];
				return res;
			})
				.then(res => res.blob())
				.then(blob => {
					return FileSaver.saveAs(blob, fileName);
				})
		}
	}

	return (
		<>
			{
				displayModal && (
					<CollectionExportModal
						ids={[id]}
						exportOds={handleExportCollectionList('ods')}
						exportOdt={handleExportCollectionList('odt')}
						close={() => setDisplayModal(false)}></CollectionExportModal>
				)
			}
			<ActionToolbar>
				{btns.map((btn) => {
					if (!btn) return null;
					const [action, label] = btn;
					return btn && <Button key={label} action={action} label={label} />;
				})}
			</ActionToolbar>
		</>
	);
};

CollectionVisualizationControls.propTypes = {
	id: PropTypes.string.isRequired,
	permission: permissionOverviewPropTypes.isRequired,
	isValidated: PropTypes.bool.isRequired,
	handleValidation: PropTypes.func.isRequired,
};

export default withRouter(CollectionVisualizationControls);
