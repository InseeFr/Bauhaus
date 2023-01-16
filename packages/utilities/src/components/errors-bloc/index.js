import React from 'react';
import PropTypes from 'prop-types';
import './errors-bloc.scss';

export const ClientSideError = ({ error }) => {
	return error ? <div className='text-danger' dangerouslySetInnerHTML={{ __html: error }}></div> : null;
}
export const GlobalClientSideErrorBloc = ({ clientSideErrors, D }) => {
	return clientSideErrors?.length > 0 ? <div className="bauhaus-error-bloc alert alert-danger" role="alert">{<div dangerouslySetInnerHTML={{ __html: D.errors.GlobalClientSideErrorBloc }} /> || <span style={{ whiteSpace: 'pre-wrap' }}> </span>}</div> : null
}
const ErrorBloc = ({ error, D }) => {
	const errors = Array.isArray(error) ? error : [error];

	const formattedErrors = errors.map(e => {
		let errorMsg;
		try {
			const parsedError = JSON.parse(e);

			if(parsedError.code && D.errors[parsedError.code]){
				errorMsg = D.errors[parsedError.code](parsedError);
			} else if(parsedError.message && D.errors[parsedError.message]){
				errorMsg = D.errors[parsedError.message](parsedError);
			}
			else {
				errorMsg = parsedError.message
			}
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
