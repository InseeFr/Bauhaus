import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'bauhaus-library';
import PlaceHolder from 'js/applications/shared/placeholder/placeholder';
import { goBack } from 'bauhaus-library/src/utils/redirection';
import D from 'js/i18n';

function OperationsControls(props) {
	const { openModal } = props;
	const cancel = [goBack(props, `/operations/series`), D.btnReturn];

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

export default withRouter(OperationsControls);
