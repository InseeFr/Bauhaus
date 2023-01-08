import React from 'react';
import PropTypes from 'prop-types';
import './errors-bloc.scss';

const ErrorBloc = ({ error, D }) => {
	const errors = Array.isArray(error) ? error : [error];

	const formattedErrors = errors.map(e => {
		let errorMsg;
		try {
			const parsedError = JSON.parse(e);
			errorMsg = parsedError.code
				? D.errors[parsedError.code](parsedError)
				: parsedError.message;
		} catch (error) {
			errorMsg = e;
		}
		return errorMsg;
	})

	return formattedErrors.map((e, index) => <div key={index} className="bauhaus-error-bloc alert alert-danger" role="alert">{<div dangerouslySetInnerHTML={{ __html: e }} /> || <span style={{ whiteSpace: 'pre-wrap' }}> </span>}</div>);
};

ErrorBloc.propTypes = {
	error: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
};

export default ErrorBloc;
