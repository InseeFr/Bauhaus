import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Button from 'js/components/shared/button';
import PlaceHolder from 'js/components/shared/placeholder';
import check from 'js/utils/auth/utils';
import { propTypes as permissionOverviewPropTypes } from 'js/utils/auth/permission-overview';
import { dictionary } from 'js/utils/dictionary';

class ConceptVisualizationControls extends Component {
	render() {
		const {
			isValidated,
			isValidOutOfDate,
			conceptVersion,
			id,
			permission: { authType, role, stamp },
			creator: conceptCreator,
			handleValidation,
		} = this.props;

		const authImpl = check(authType);
		const admin = authImpl.isAdmin(role);
		const contributor = authImpl.isContributor(role);
		const creator = authImpl.isConceptCreator(role, stamp, conceptCreator);
		const adminOrCreator = admin || creator;
		const adminOrContributorOrCreator = admin || contributor || creator;

		// TODO : Fix buttons logic with CREATOR role (comparing to stamps)
		let btns;

		const cancel = [
			this.props.history.length === 1
				? `/concepts`
				: () => this.props.history.goBack(),
			dictionary.buttons.return,
		];
		const send = [`/concept/${id}/send`, dictionary.buttons.send];
		const validate = adminOrCreator && [
			handleValidation,
			dictionary.buttons.validate,
		];
		const update = [`/concept/${id}/modify`, dictionary.buttons.modify];
		const compare =
			adminOrContributorOrCreator &&
			(!conceptVersion || conceptVersion <= 1
				? null
				: [`/concept/${id}/compare`, dictionary.buttons.compare]);

		if (admin) {
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
