import React from 'react';
import PropTypes from 'prop-types';

const ErrorBloc = ({ error }) => {
	return (
		<div className="empty-center centered">
			<div
				style={{ visibility: error ? 'visible' : 'hidden' }}
				className="alert alert-danger"
				role="alert"
			>
				{error || <span style={{ whiteSpace: 'pre-wrap' }}> </span>}
			</div>
		</div>
	);
};

ErrorBloc.propTypes = {
	error: PropTypes.string,
};

export default ErrorBloc;
