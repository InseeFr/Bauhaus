import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { I18NContext } from '../context';

const ErrorBloc = ({ error }) => {
	const D = useContext(I18NContext);
	// This will be changed when an error will be an object
	const code = error && error.substr(0, error.indexOf(':')).trim();
	const errorMsg = D.errors[code || '0'] || error;
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
