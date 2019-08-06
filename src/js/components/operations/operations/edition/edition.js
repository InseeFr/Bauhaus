import React, { Component } from 'react';
import D from 'js/i18n';
import { goBack, goBackOrReplace } from 'js/utils/redirection';
import NoteFlag from 'js/components/shared/note-flag/note-flag';
import PropTypes from 'prop-types';
import {
	CancelButton,
	SaveButton,
} from 'js/components/shared/button-with-icon';
import SelectRmes from 'js/components/shared/select-rmes';
import { validate } from './validation';
import Loading from 'js/components/shared/loading';
import PageTitleBlock from 'js/components/shared/page-title-block';
import ErrorBloc from 'js/components/shared/error-bloc';

const defaultOperation = {
	prefLabelLg1: '',
	prefLabelLg2: '',
	altLabelLg1: '',
	altLabelLg2: '',
};
class OperationsOperationEdition extends Component {
	static propTypes = {
		operation: PropTypes.object.isRequired,
		langs: PropTypes.object.isRequired,
		saveOperation: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);
		this.state = this.setInitialState(props);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.operation.id !== this.props.operation.id) {
			this.setState(this.setInitialState(nextProps));
		}
	}

	setInitialState = props => {
		return {
			serverSideError: '',
			operation: {
				...defaultOperation,
				...props.operation,
			},
		};
	};

	onChange = e => {
		let override = {
			[e.target.id]: e.target.value,
		};
		if (e.target.id === 'idSeries') {
			override = {
				series: {
					id: e.target.value,
				},
			};
		}
		this.setState({
			serverSideError: '',
			operation: {
				...this.state.operation,
				...override,
			},
		});
	};
	onSubmit = () => {
		const isCreation = !this.state.operation.id;

		this.props.saveOperation(
			this.state.operation,
			(err, id = this.state.operation.id) => {
				if (!err) {
					goBackOrReplace(
						this.props,
						`/operations/operation/${id}`,
						isCreation
					);
				} else {
					this.setState({
						serverSideError: err,
					});
				}
			}
		);
	};

	render() {
		if (this.props.operationsAsyncTask) return <Loading textType="saving" />;

		const {
			langs: { lg1, lg2 },
		} = this.props;

		const seriesOptions = this.props.series
			.filter(series => !series.idSims)
			.map(({ id, label }) => {
				return { value: id, label: label };
			});
		const { operation, serverSideError } = this.state;
		const series = operation.series || { id: '' };
		const isEditing = !!operation.id;

		const errors = validate(operation);
		const globalError = errors.errorMessage || serverSideError;
		return (
			<div className="container editor-container">
				{isEditing && (
					<PageTitleBlock
						titleLg1={this.props.operation.prefLabelLg1}
						titleLg2={this.props.operation.prefLabelLg2}
						secondLang={true}
					/>
				)}

				<div className="row btn-line action-toolbar">
					<CancelButton action={goBack(this.props, '/operations/operations')} />

					<ErrorBloc error={globalError} />

					<SaveButton action={this.onSubmit} disabled={errors.errorMessage} />
				</div>
				<form>
					{!isEditing && (
						<div className="row">
							<div className="form-group col-md-12">
								<SelectRmes
									placeholder={D.seriesTitle}
									unclearable
									value={series.id}
									options={seriesOptions}
									onChange={value =>
										this.onChange({
											target: { value, id: 'idSeries' },
										})
									}
								/>
							</div>
						</div>
					)}

					<div className="row">
						<div className="form-group col-md-6">
							<label htmlFor="prefLabelLg1">
								<NoteFlag text={D.title} lang={lg1} />
								<span className="boldRed">*</span>
							</label>
							<input
								type="text"
								className="form-control"
								id="prefLabelLg1"
								value={operation.prefLabelLg1}
								onChange={this.onChange}
								aria-invalid={errors.fields.prefLabelLg1}
							/>
						</div>
						<div className="form-group col-md-6">
							<label htmlFor="prefLabelLg2">
								<NoteFlag text={D.title} lang={lg2} />
								<span className="boldRed">*</span>
							</label>
							<input
								type="text"
								className="form-control"
								id="prefLabelLg2"
								value={operation.prefLabelLg2}
								onChange={this.onChange}
								aria-invalid={errors.fields.prefLabelLg2}
							/>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-6">
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
						<div className="form-group col-md-6">
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
				</form>
			</div>
		);
	}
}

export default OperationsOperationEdition;
