import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import check from 'js/utils/auth/utils';
import { propTypes as permissionOverviewPropTypes } from 'js/utils/auth/permission-overview';
import { dictionary } from 'js/utils/dictionary';

const Button = ({ action, label }) => {
	let button;
	if (typeof action === 'string') {
		button = (
			<Link className="btn btn-primary btn-lg col-md-12" to={action}>
				{label}
			</Link>
		);
	} else {
		//if action is a function, it means a handler was passed in instead of an URL
		button = (
			<button className="btn btn-primary btn-lg col-md-12" onClick={action}>
				{label}
			</button>
		);
	}
	return <div className="col-md-2">{button}</div>;
};

const PlaceHolder = () => <div className="col-md-2" />;

Button.propTypes = {
	//handler or url
	action: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
	label: PropTypes.string.isRequired,
};

class ConceptVisualizationControls extends Component {
	render() {
		const {
			isValidated,
			isValidOutOfDate,
			conceptVersion,
			id,
			permission: { authType, role },
			handleValidation,
		} = this.props;

		const authImpl = check(authType);
		const admin = authImpl.isAdmin(role);
		const contributor = authImpl.isContributor(role);
		const creator = authImpl.isConceptCreator(role);
		const adminOrCreator = admin || creator;

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
			!conceptVersion || conceptVersion <= 1
				? null
				: [`/concept/${id}/compare`, dictionary.buttons.compare];

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
	isValidated: PropTypes.bool.isRequired,
	conceptVersion: PropTypes.string.isRequired,
	handleValidation: PropTypes.func.isRequired,
};

export default withRouter(ConceptVisualizationControls);
