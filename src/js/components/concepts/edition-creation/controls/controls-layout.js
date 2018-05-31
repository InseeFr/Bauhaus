import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import D from 'js/i18n';

class ConceptCreateControlLayout extends Component {
	render() {
		const { message, handleSave, saveEnabled, redirectCancel } = this.props;

		return (
			<div className="row btn-line">
				<div className="col-md-2">
					<Link
						to={redirectCancel()}
						className="btn btn-primary btn-lg col-md-12"
					>
						<span
							className="glyphicon glyphicon-floppy-remove"
							aria-hidden="true"
						/>{' '}
						{D.btnCancel}
					</Link>
				</div>
				<div className="col-md-8 centered">
					<div
						style={{ visibility: message ? 'visible' : 'hidden' }}
						className="alert alert-danger bold"
						role="alert"
					>
						{/* HACK: if no content, the line height is set to 0 and the rest
              of the page moves a little  */}
						{message || <span style={{ whiteSpace: 'pre-wrap' }}> </span>}
					</div>
				</div>
				<div className="col-md-2 pull-right">
					<button
						type="button"
						className="btn btn-primary btn-lg col-md-12"
						disabled={!saveEnabled}
						onClick={handleSave}
					>
						<span
							className="glyphicon glyphicon-floppy-disk"
							aria-hidden="true"
						/>{' '}
						{D.btnSave}
					</button>
				</div>
			</div>
		);
	}
}

ConceptCreateControlLayout.propTypes = {
	message: PropTypes.string,
	saveEnabled: PropTypes.bool.isRequired,
	handleSave: PropTypes.func.isRequired,
	redirectCancel: PropTypes.func.isRequired,
};

export default withRouter(ConceptCreateControlLayout);
