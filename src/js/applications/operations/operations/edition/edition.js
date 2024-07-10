import { Component } from 'react';
import D, { D1, D2 } from 'js/i18n';
import { Loading } from 'js/new-architecture/components/loading/loading';

import {
	CancelButton,
	SaveButton,
	ActionToolbar,
	LabelRequired,
	Select,
} from '@inseefr/wilco';
import { validate } from './validation';
import {
	PageTitleBlock,
	withTitle,
	ErrorBloc,
	GlobalClientSideErrorBloc,
	ClientSideError,
} from 'js/utils';
import api from '../../../../remote-api/operations-api';
import { TextInput } from '../../../../new-architecture/components';

const defaultOperation = {
	prefLabelLg1: '',
	prefLabelLg2: '',
	altLabelLg1: '',
	altLabelLg2: '',
};
class OperationsOperationEdition extends Component {
	constructor(props) {
		super(props);
		this.state = this.setInitialState(props);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.operation.id !== this.props.operation.id) {
			this.setState(this.setInitialState(nextProps));
		}
	}

	setInitialState = (props) => {
		return {
			serverSideError: '',
			clientSideErrors: {},
			saving: false,
			submitting: false,
			operation: {
				...defaultOperation,
				...props.operation,
			},
		};
	};

	onChange = (e) => {
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
		this.setState((state) => ({
			serverSideError: '',
			submitting: true,
			clientSideErrors: {
				...state.clientSideErrors,
				errorMessage: [],
			},
			operation: {
				...this.state.operation,
				...override,
			},
		}));
	};
	onSubmit = () => {
		const clientSideErrors = validate(this.state.operation);
		if (clientSideErrors.errorMessage?.length > 0) {
			this.setState({
				submitting: true,
				clientSideErrors,
			});
		} else {
			this.setState({ saving: true });
			const isCreation = !this.state.operation.id;

			const method = isCreation ? 'postOperation' : 'putOperation';
			return api[method](this.state.operation)
				.then(
					(id = this.state.operation.id) => {
						this.props.goBack(`/operations/operation/${id}`, isCreation);
					},
					(err) => {
						this.setState({
							serverSideError: err,
						});
					}
				)
				.finally(() => this.setState({ saving: false }));
		}
	};

	render() {
		if (this.state.saving) return <Loading textType="saving" />;

		const seriesOptions = this.props.series
			.filter((series) => !series.idSims)
			.map(({ id, label }) => {
				return { value: id, label: label };
			});
		const { operation, serverSideError } = this.state;
		const series = operation.series || { id: '' };
		const isEditing = !!operation.id;

		const { goBack } = this.props;

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
					<CancelButton action={() => goBack('/operations/operations')} />

					<SaveButton
						action={this.onSubmit}
						disabled={this.state.clientSideErrors.errorMessage?.length > 0}
					/>
				</ActionToolbar>

				{this.state.submitting && this.state.clientSideErrors && (
					<GlobalClientSideErrorBloc
						clientSideErrors={this.state.clientSideErrors.errorMessage}
						D={D}
					/>
				)}
				{serverSideError && <ErrorBloc error={serverSideError} D={D} />}

				<form>
					{!isEditing && (
						<div className="row">
							<div className="form-group col-md-12">
								<LabelRequired>{D.serieTitle}</LabelRequired>
								<Select
									placeholder={D.seriesTitle}
									unclearable
									value={seriesOptions.find(({ value }) => value === series.id)}
									options={seriesOptions}
									onChange={(value) =>
										this.onChange({
											target: { value, id: 'idSeries' },
										})
									}
								/>
								<ClientSideError
									id="series-error"
									error={this.state.clientSideErrors?.fields?.series}
								></ClientSideError>
							</div>
						</div>
					)}

					<div className="row">
						<div className="form-group col-md-6">
							<LabelRequired htmlFor="prefLabelLg1">{D1.title}</LabelRequired>
							<TextInput
								id="prefLabelLg1"
								value={operation.prefLabelLg1}
								onChange={this.onChange}
								aria-invalid={
									!!this.state.clientSideErrors.fields?.prefLabelLg1
								}
								aria-describedby={
									!!this.state.clientSideErrors.fields?.prefLabelLg1
										? 'prefLabelLg1-error'
										: null
								}
							/>
							<ClientSideError
								id="prefLabelLg1-error"
								error={this.state.clientSideErrors?.fields?.prefLabelLg1}
							></ClientSideError>
						</div>
						<div className="form-group col-md-6">
							<LabelRequired htmlFor="prefLabelLg2">{D2.title}</LabelRequired>
							<TextInput
								id="prefLabelLg2"
								value={operation.prefLabelLg2}
								onChange={this.onChange}
								aria-invalid={
									!!this.state.clientSideErrors.fields?.prefLabelLg2
								}
								aria-describedby={
									!!this.state.clientSideErrors.fields?.prefLabelLg2
										? 'prefLabelLg2-error'
										: null
								}
							/>
							<ClientSideError
								id="prefLabelLg2-error"
								error={this.state.clientSideErrors?.fields?.prefLabelLg2}
							></ClientSideError>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-6">
							<label htmlFor="altLabelLg1">{D1.altLabel}</label>
							<TextInput
								id="altLabelLg1"
								value={operation.altLabelLg1}
								onChange={this.onChange}
							/>
						</div>
						<div className="form-group col-md-6">
							<label htmlFor="altLabelLg2">{D2.altLabel}</label>
							<TextInput
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

export default withTitle(
	OperationsOperationEdition,
	D.operationsTitle,
	(props) => {
		return props.operation?.prefLabelLg1 || D.operationsCreateTitle;
	}
);
