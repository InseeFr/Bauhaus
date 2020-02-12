import React from 'react';
import { Link } from 'react-router-dom';
import D from 'js/i18n';
import { ActionToolbar } from '@inseefr/wilco';

function Controls() {
	return (
		<ActionToolbar>
			<div className="col-md-2">
				<Link
					className="btn bauhaus-btn btn-lg col-md-12"
					to={'/concepts/administration'}
				>
					{D.btnReturn}
				</Link>
			</div>
		</ActionToolbar>
	);
}

export default Controls;
