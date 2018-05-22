import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Button from 'js/components/shared/button';
import PlaceHolder from 'js/components/shared/placeholder';
import check from 'js/utils/auth';
import { propTypes as permissionOverviewPropTypes } from 'js/utils/auth/permission-overview';
import D from 'js/i18n';

class ConceptVisualizationControls extends Component {
	render() {
		const {
			isValidated,
			isValidOutOfDate,
			conceptVersion,
			id,
			permission: { authType, roles, stamp },
			creator: conceptCreator,
			handleValidation,
		} = this.props;

		const authImpl = check(authType);
		const admin = authImpl.isAdmin(roles);
		const contributor = authImpl.isContributor(roles);
		const creator = authImpl.isConceptCreator(roles, stamp, conceptCreator);
		const adminOrCreator = admin || creator;
		const adminOrContributorOrCreator = admin || contributor || creator;

		let btns;

		const cancel = [
			this.props.history.length === 1
				? `/concepts`
				: () => this.props.history.goBack(),
			D.btnReturn,
		];
		const send = [`/concept/${id}/send`, D.btnSend];
		const validate = adminOrCreator && [handleValidation, D.btnValid];
		const update = [`/concept/${id}/modify`, D.btnUpdate];
		const compare =
			adminOrContributorOrCreator &&
			(!conceptVersion || conceptVersion <= 1
				? null
				: [`/concept/${id}/compare`, D.btnCompare]);

		if (admin || (creator && contributor)) {
			if (isValidOutOfDate) {
				btns = isValidated
					? [cancel, null, null, null, compare, send]
					: [cancel, null, compare, send, update, validate];
			} else {
				btns = isValidated
					? [cancel, null, null, compare, send, update]
					: [cancel, null, compare, send, update, validate];
			}
		} else if (contributor) {
			if (isValidOutOfDate) {
				btns = isValidated
					? [cancel, null, null, null, compare, send]
					: [cancel, null, null, compare, send, update];
			} else {
				btns = [cancel, null, null, compare, send, update];
			}
		} else if (creator) {
			if (isValidOutOfDate) {
				btns = isValidated
					? [cancel, null, null, null, compare, send]
					: [cancel, null, null, compare, send, validate];
			} else {
				btns = isValidated
					? [cancel, null, null, null, compare, send]
					: [cancel, null, null, compare, send, validate];
			}
		} else {
			btns = [cancel, null, null, null, null, compare];
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

ConceptVisualizationControls.propTypes = {
	id: PropTypes.string.isRequired,
	permission: permissionOverviewPropTypes,
	creator: PropTypes.string.isRequired,
	isValidated: PropTypes.bool.isRequired,
	conceptVersion: PropTypes.string.isRequired,
	handleValidation: PropTypes.func.isRequired,
};

export default withRouter(ConceptVisualizationControls);
