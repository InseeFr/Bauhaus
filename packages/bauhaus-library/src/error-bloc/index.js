import React from 'react';
import PropTypes from 'prop-types';
import D from '../build-dictionary';

const ErrorBloc = ({ error }) => {
	let errorMsg;
	try {
		const parsedError = JSON.parse(error);
		errorMsg = parsedError.code
			? D.errors[parsedError.code](parsedError)
			: parsedError.message;
	} catch (e) {
		errorMsg = error;
	}

	return (
		<div className="empty-center centered">
			<div
				style={{ visibility: errorMsg ? 'visible' : 'hidden' }}
				className="alert alert-danger"
				role="alert"
			>
				{errorMsg || <span style={{ whiteSpace: 'pre-wrap' }}> </span>}
			</div>
		</div>
	);
};

ErrorBloc.propTypes = {
	error: PropTypes.string,
};

export default ErrorBloc;
