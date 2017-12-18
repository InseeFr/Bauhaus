import React from 'react';
import { Link } from 'react-router-dom';
import { dictionary } from 'js/utils/dictionary';

function Controls() {
	return (
		<div className="row btn-line">
			<div className="col-md-2">
				<Link
					className="btn btn-primary btn-lg col-md-12"
					to={'/administration'}
				>
					{dictionary.buttons.return}
				</Link>
			</div>
		</div>
	);
}

export default Controls;
