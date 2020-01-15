import React from 'react';
import { Link } from 'react-router-dom';
import D from 'js/i18n';

function Controls() {
	return (
		<div className="row btn-line action-toolbar">
			<div className="col-md-2">
				<Link
					className="btn btn-primary btn-lg col-md-12"
					to={'/concepts/administration'}
				>
					{D.btnReturn}
				</Link>
			</div>
		</div>
	);
}

export default Controls;
