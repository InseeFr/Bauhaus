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
	Select,
} from '@inseefr/wilco';
import { validate } from './validation';
import { PageTitleBlock, withTitle } from 'bauhaus-utilities';
import api from '../../../../remote-api/operations-api';

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
			saving: false,
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
		this.setState({ saving: true })
		const isCreation = !this.state.operation.id;

		const method = isCreation ? 'postOperation' : 'putOperation';
		return api[method](this.state.operation).then(
			(id = this.state.operation.id) => {
				goBackOrReplace(this.props, `/operations/operation/${id}`, isCreation);
			},
			err => {
				this.setState({
					serverSideError: err,
				});
			}
		).finally(() => this.setState({ saving: false }));
	};

	render() {
		if (this.state.saving) return <Loading textType="saving" />;

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
								<Select
									placeholder={D.seriesTitle}
									unclearable
									value={seriesOptions.find(({ value }) => value === series.id)}
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

export default withTitle(OperationsOperationEdition, D.operationsTitle, props => {
	return props.operation?.prefLabelLg1 || D.operationsCreateTitle;
});

