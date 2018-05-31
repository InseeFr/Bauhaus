import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from 'js/components/shared/button';
import PlaceHolder from 'js/components/shared/placeholder';
import { goBack } from 'js/utils/redirection';
import D from 'js/i18n';
import 'js/components/operations/operations.css';

class OperationsControls extends Component {
	render() {
		const { openModal } = this.props;

		const cancel = [goBack(this.props, `/operations/series`), D.btnReturn];

		const exportVarBook = [openModal, D.btnExport];

		const btns = [cancel, null, null, null, null, exportVarBook];
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

export default withRouter(OperationsControls);
