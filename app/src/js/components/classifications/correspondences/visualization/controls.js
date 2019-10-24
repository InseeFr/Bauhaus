import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'bauhaus-library';
import PlaceHolder from 'js/components/shared/placeholder/placeholder';
import { goBack } from 'js/utils/redirection';
import D from 'js/i18n';

class CorrespondenceControls extends Component {
	render() {
		const cancel = [
			goBack(this.props, `/classifications/correspondences`),
			D.btnReturn,
		];
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

export default withRouter(CorrespondenceControls);
