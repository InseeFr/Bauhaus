import React, { Component } from 'react';
import PageSubtitle from 'js/components/shared/page-subtitle';
import PageTitle from 'js/components/shared/page-title';
import D from 'js/i18n';
import { goBack } from 'js/utils/redirection';
import NoteFlag from 'js/components/shared/note-flag';
import PropTypes from 'prop-types';
import Button from 'js/components/shared/button';

const defaultOperation = {
	prefLabelLg1: '',
	prefLabelLg2: '',
	altLabel1: '',
	altLabel2: '',
	millesime: '',
};
class OperationsOperationEdition extends Component {
	constructor(props) {
		super(props);
		this.state = {
			operation: {
				...defaultOperation,
				...props.operation,
			},
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			operation: {
				...defaultOperation,
				...nextProps.operation,
			},
		});
	}
	onChange(e) {
		this.setState({
			operation: {
				...this.state.operation,
				[e.target.id]: e.target.value,
			},
		});
	}
	onSubmit() {
		this.props.saveOperation(this.state.operation);
		goBack(this.props, '/operations/operation/' + this.props.operation.id)();
	}

	render() {
		const { langs: { lg1, lg2 } } = this.props;

		const { operation } = this.state;

		return (
			<div className="container editor-container">
				<PageTitle
					title={this.props.operation.prefLabelLg1}
					context="operations"
				/>
				{operation.prefLabelLg2 && (
					<PageSubtitle subTitle={this.props.operation.prefLabelLg2} />
				)}

				<div className="row btn-line">
					<Button
						action={goBack(this.props, '/operations/operations')}
						label={
							<React.Fragment>
								<span
									className="glyphicon glyphicon-floppy-remove"
									aria-hidden="true"
								/>
								<span> {D.btnCancel}</span>
							</React.Fragment>
						}
						context="operations"
					/>

					<div className="col-md-8 centered" />
					<Button
						action={this.onSubmit}
						label={
							<React.Fragment>
								<span
									className="glyphicon glyphicon-floppy-disk"
									aria-hidden="true"
								/>
								<span> {D.btnSave}</span>
							</React.Fragment>
						}
						context="operations"
					/>
				</div>
				<form>
					<div className="row">
						<div className="col-md-6">
							<div className="form-group">
								<label htmlFor="prefLabelLg1">
									<NoteFlag text={D.title} lang={lg1} />
								</label>
								<input
									type="text"
									className="form-control"
									id="prefLabelLg1"
									value={this.state.operation.prefLabelLg1}
									onChange={this.onChange}
									disabled
								/>
							</div>
						</div>
						<div className="col-md-6">
							<div className="form-group">
								<label htmlFor="prefLabelLg2">
									<NoteFlag text={D.title} lang={lg2} />
								</label>
								<input
									type="text"
									className="form-control"
									id="prefLabelLg2"
									value={operation.prefLabelLg2}
									onChange={this.onChange}
									disabled
								/>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-md-6">
							<div className="form-group">
								<label htmlFor="altLabelLg1">
									<NoteFlag text={D.altLabel} lang={lg1} />
								</label>
								<input
									type="text"
									className="form-control"
									id="altLabelLg1"
									value={operation.altLabelLg1}
									onChange={this.onChange}
								/>
							</div>
						</div>
						<div className="col-md-6">
							<div className="form-group">
								<label htmlFor="altLabelLg2">
									<NoteFlag text={D.altLabel} lang={lg2} />
								</label>
								<input
									type="text"
									className="form-control"
									id="altLabelLg2"
									value={operation.altLabelLg2}
									onChange={this.onChange}
								/>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-md-12">
							<div className="form-group">
								<label htmlFor="millesime">
									<NoteFlag text={D.year} lang={lg1} />
								</label>
								<textarea
									value={operation.millesime}
									className="form-control"
									id="millesime"
									rows="10"
									onChange={this.onChange}
								/>
							</div>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

OperationsOperationEdition.propTypes = {
	operation: PropTypes.object.isRequired,
	langs: PropTypes.object.isRequired,
	saveOperation: PropTypes.func.isRequired,
};

export default OperationsOperationEdition;
