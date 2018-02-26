import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Button from 'js/components/shared/button';
import PlaceHolder from 'js/components/shared/placeholder';
import check from 'js/utils/auth/utils';
import { propTypes as permissionOverviewPropTypes } from 'js/utils/auth/permission-overview';
import { dictionary } from 'js/utils/dictionary';

class CollectionVisualizationControls extends Component {
	render() {
		const {
			isValidated,
			permission: { authType, role },
			id,
			handleValidation,
		} = this.props;

		const authImpl = check(authType);
		const admin = authImpl.isAdmin(role);
		const contributor = authImpl.isContributor(role);
		const creator = authImpl.isCollectionCreator(role);

		let btns;

		const cancel = [`/collections`, dictionary.buttons.return];
		const send = [`/collection/${id}/send`, dictionary.buttons.send];
		const validate = [handleValidation, dictionary.buttons.validate];
		const update = [`/collection/${id}/modify`, dictionary.buttons.modify];

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
