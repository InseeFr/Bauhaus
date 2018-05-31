import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Button from 'js/components/shared/button';
import PlaceHolder from 'js/components/shared/placeholder';
import { goBack } from 'js/utils/redirection';
import D from 'js/i18n';

class LevelControls extends Component {
	render() {
		const { id } = this.props;
		const cancel = [
			goBack(this.props, `/classifications/classification/${id}`),
			D.btnReturn,
		];
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

LevelControls.propTypes = {
	id: PropTypes.string.isRequired,
};

export default withRouter(LevelControls);
