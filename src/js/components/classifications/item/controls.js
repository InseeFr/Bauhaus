import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Button from 'js/components/shared/button';
import PlaceHolder from 'js/components/shared/placeholder';
import D from 'js/i18n';

class ItemControls extends Component {
	render() {
		const { classificationId, itemId, version } = this.props;
		const cancel = [
			this.props.history.length === 1
				? `/classifications/classification/${classificationId}/item/${itemId}`
				: () => this.props.history.goBack(),
			D.btnReturn,
		];
		const compare =
			!version || version <= 1
				? null
				: [
						`/classifications/classification/${classificationId}/item/${itemId}/compare`,
						D.btnCompare,
					];
		const btns = [cancel, null, null, null, null, compare];

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

ItemControls.propTypes = {
	classificationId: PropTypes.string.isRequired,
	itemId: PropTypes.string.isRequired,
	version: PropTypes.string.isRequired,
};

export default withRouter(ItemControls);
