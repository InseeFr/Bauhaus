import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button } from 'bauhaus-library';
import PlaceHolder from 'js/components/shared/placeholder/placeholder';
import { goBack } from 'bauhaus-library/src/utils/redirection';
import D from 'js/i18n';

class ClassificationControls extends Component {
	render() {
		const location = this.props.history.location.pathname;
		const nextLocation = location.replace('/items', '');
		const cancel = [goBack(this.props, nextLocation), D.btnReturn];
		const btns = [cancel, null, null, null, null, null];

		return (
			<div className="row btn-line">
				{btns.map((btn, i) => {
					if (!btn) return <PlaceHolder key={i} />;
					const [action, label] = btn;
					return (
						btn && (
							<Button
								key={label}
								action={action}
								label={label}
								context="classifications"
							/>
						)
					);
				})}
			</div>
		);
	}
}

ClassificationControls.propTypes = {
	id: PropTypes.string,
};

export default withRouter(ClassificationControls);
