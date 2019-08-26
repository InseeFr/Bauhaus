import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Button from 'js/components/shared/button';
import D from 'js/i18n';

class ConceptCreateControlLayout extends Component {
	render() {
		const { message, handleSave, saveEnabled, redirectCancel } = this.props;

		return (
			<div className="row btn-line">
				<Button
					label={
						<React.Fragment>
							<span
								className="glyphicon glyphicon-floppy-remove"
								aria-hidden="true"
							/>
							<span> {D.btnCancel}</span>
						</React.Fragment>
					}
					action={redirectCancel()}
				/>
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
				<Button
					label={
						<React.Fragment>
							<span
								className="glyphicon glyphicon-floppy-disk"
								aria-hidden="true"
							/>
							<span> {D.btnSave}</span>
						</React.Fragment>
					}
					action={handleSave}
					disabled={!saveEnabled}
				/>
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
