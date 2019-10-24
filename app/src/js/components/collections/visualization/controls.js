import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button } from 'bauhaus-library';
import PlaceHolder from 'js/components/shared/placeholder/placeholder';
import check from 'js/utils/auth';
import { propTypes as permissionOverviewPropTypes } from 'js/utils/auth/permission-overview';
import D from 'js/i18n';

class CollectionVisualizationControls extends Component {
	render() {
		const {
			isValidated,
			permission: { authType, roles, stamp },
			creator: collectionCreator,
			id,
			handleValidation,
		} = this.props;

		const authImpl = check(authType);
		const admin = authImpl.isAdmin(roles);
		const contributor = authImpl.isContributor(roles);
		const creator = authImpl.isCollectionCreator(
			roles,
			stamp,
			collectionCreator
		);

		let btns;

		const cancel = [`/collections`, D.btnReturn];
		const send = [`/collection/${id}/send`, D.btnSend];
		const validate = [handleValidation, D.btnValid];
		const update = [`/collection/${id}/modify`, D.btnUpdate];

		if (admin || creator) {
			btns = isValidated
				? [cancel, null, null, null, send, update]
				: [cancel, null, null, send, update, validate];
		} else if (contributor) {
			btns = [cancel, null, null, null, send, update];
		} else {
			btns = [cancel, null, null, null, null, null];
		}

		return (
			<div className="row btn-line">
				{btns.map((btn, i) => {
					if (!btn) return <PlaceHolder key={i} />;
					const [action, label] = btn;
					return btn && <Button key={label} action={action} label={label} />;
				})}
			</div>
		);
	}
}

CollectionVisualizationControls.propTypes = {
	id: PropTypes.string.isRequired,
	permission: permissionOverviewPropTypes.isRequired,
	isValidated: PropTypes.bool.isRequired,
	handleValidation: PropTypes.func.isRequired,
};

export default withRouter(CollectionVisualizationControls);
