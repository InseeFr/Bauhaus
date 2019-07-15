import React from 'react';

export default ({ error }) => {
	return (
		<div className="empty-center centered">
			<div
				style={{ visibility: error ? 'visible' : 'hidden' }}
				className="alert alert-danger bold"
				role="alert"
			>
				{error || <span style={{ whiteSpace: 'pre-wrap' }}> </span>}
			</div>
		</div>
	);
};
