import React, { Component } from 'react';
import D, { D1, D2 } from 'js/i18n';
import PropTypes from 'prop-types';
import {
	CancelButton,
	SaveButton,
	Loading,
	ErrorBloc,
	ActionToolbar,
	goBack,
	goBackOrReplace,
	LabelRequired,
} from '@inseefr/wilco';
import SelectRmes from 'js/applications/shared/select-rmes';
import { validate } from './validation';
import PageTitleBlock from 'js/applications/shared/page-title-block';

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

				<ActionToolbar>
					<CancelButton action={goBack(this.props, '/operations/operations')} />

					<SaveButton action={this.onSubmit} disabled={errors.errorMessage} />
				</ActionToolbar>

				<ErrorBloc error={globalError} />

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
							<LabelRequired htmlFor="prefLabelLg1">{D1.title}</LabelRequired>
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
							<LabelRequired htmlFor="prefLabelLg2">{D2.title}</LabelRequired>
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
							<label htmlFor="altLabelLg1">{D1.altLabel}</label>
							<input
								type="text"
								className="form-control"
								id="altLabelLg1"
								value={operation.altLabelLg1}
								onChange={this.onChange}
							/>
						</div>
						<div className="form-group col-md-6">
							<label htmlFor="altLabelLg2">{D2.altLabel}</label>
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
