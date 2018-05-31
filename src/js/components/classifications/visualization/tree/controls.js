import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Button from 'js/components/shared/button';
import PlaceHolder from 'js/components/shared/placeholder';
import { goBack } from 'js/utils/redirection';
import D from 'js/i18n';

class ClassificationControls extends Component {
	render() {
		const location = this.props.history.location.pathname;
		const nextLocation = location.replace('/tree', '');
		const cancel = [goBack(this.props, nextLocation), D.btnReturn];
		const btns = [cancel, null, null, null, null, null];

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

ClassificationControls.propTypes = {
	id: PropTypes.string,
};

export default withRouter(ClassificationControls);
