import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import Loading from 'js/components/shared/loading';
import D from 'js/i18n';
import { PENDING, OK, ERROR } from 'js/constants';

function ConceptSendStatus({ label, status, urlBack }) {
	if (status === PENDING)
		return <Loading textType="sending" context="concepts" />;

	const title = status === OK ? D.sendConceptSuccess(label) : D.sendConceptFailure(label);

	return (
		<div className="container">
			<div className="row centered">
				<div className="col-md-12">
					<h2>{title}</h2>
				</div>
			</div>
			<div className="row">
				<div className="col-md-12">
					<Link
						className="btn btn-primary btn-lg col-md-2 col-md-offset-5"
						to={urlBack}
					>
						{D.btnReturn}
					</Link>
				</div>
			</div>
		</div>
	);
}

ConceptSendStatus.propTypes = {
	status: PropTypes.oneOf([OK, PENDING, ERROR]),
	urlBack: PropTypes.string.isRequired,
};

export default ConceptSendStatus;
