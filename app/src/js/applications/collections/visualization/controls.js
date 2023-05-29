import React  from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { ActionToolbar, Button } from '@inseefr/wilco';
import check from 'js/utils/auth';
import { propTypes as permissionOverviewPropTypes } from 'js/utils/auth/permission-overview';
import D from 'js/i18n';
import ExportButtons from '../export-buttons';

const CollectionVisualizationControls = ({
		 isValidated,
		 permission: { authType, roles, stamp },
		 creator: collectionCreator,
		 id,
		 handleValidation,
		 setExporting
	 }) => {

	const authImpl = check(authType);
	const admin = authImpl.isAdmin(roles);
	const contributor = authImpl.isContributor(roles, stamp, collectionCreator);
	const creator = authImpl.isCollectionCreator(
		roles,
		stamp,
		collectionCreator,
	);


	const validate = <Button action={handleValidation} label={D.btnValid} />;
	const update = <Button action={`/collection/${id}/modify`} label={D.btnUpdate} />;

	const btns = []
	if (admin || creator) {
		btns.push(update);

		if(!isValidated){
			btns.push(validate)
		}
	} else if (contributor) {
		btns.push(update);
	}

	return (
			<ActionToolbar>
				<Button action={`/collections`} label={D.btnReturn} />
				<ExportButtons ids={[ id ]} exporting={state => setExporting(state)}></ExportButtons>
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
