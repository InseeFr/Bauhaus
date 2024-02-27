import React, { Component } from 'react';
import D, { D1, D2 } from 'js/i18n';
import PropTypes from 'prop-types';
import {
	EditorMarkdown,
	ItemToSelectModel,
	PageTitleBlock,
	withTitle,
	SelectRmes,
	ErrorBloc,
	GlobalClientSideErrorBloc,
	ClientSideError,
	RequiredIcon,
} from 'bauhaus-utilities';
import { PublishersInput, CreatorsInput } from 'bauhaus-operations';
import { CL_FREQ } from 'js/actions/constants/codeList';
import InputRmes from 'js/applications/shared/input-rmes';
import Control from 'js/applications/operations/indicators/edition/control';
import { validate } from 'js/applications/operations/indicators/edition/validation';
import { Loading } from '@inseefr/wilco';
import api from '../../../../remote-api/operations-api';

const defaultIndicator = {
	prefLabelLg1: '',
	prefLabelLg2: '',
	altLabelLg1: '',
	altLabelLg2: '',
	abstractLg1: '',
	abstractLg2: '',
	historyNoteLg1: '',
	historyNoteLg2: '',
	accrualPeriodicityList: CL_FREQ,
};
class OperationsIndicatorEdition extends Component {
	static propTypes = {
		indicator: PropTypes.object.isRequired,
		langs: PropTypes.object.isRequired,
		saveIndicator: PropTypes.func.isRequired,
		frequencies: PropTypes.object.isRequired,
		stamps: PropTypes.arrayOf(PropTypes.string),
	};

	constructor(props) {
		super(props);
		this.state = this.setInitialState(props);

		this.onChanges = [
			'prefLabelLg1',
			'prefLabelLg2',
			'altLabelLg1',
			'altLabelLg2',
			'abstractLg1',
			'abstractLg2',
			'historyNoteLg1',
			'historyNoteLg2',
			'accrualPeriodicityCode',
		].reduce(
			(acc, selector) => ({
				...acc,
				[selector]: this.onChange(selector),
			}),
			{}
		);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.indicator.id !== this.props.indicator.id) {
			this.setState(this.setInitialState(nextProps));
		}
	}

	setInitialState = (props) => {
		return {
			serverSideError: '',
			clientSideErrors: {},
			submitting: false,
			saving: false,
			indicator: {
				...defaultIndicator,
				...props.indicator,
			},
		};
	};

	onChange = (selector) => {
		return (value) => {
			this.setState((state) => ({
				serverSideError: '',
				submitting: true,
				clientSideErrors: {
					...state.clientSideErrors,
					errorMessage: [],
				},
				indicator: {
					...this.state.indicator,
					[selector]: value,
				},
			}));
		};
	};

	onSubmit = () => {
		const clientSideErrors = validate(this.state.indicator);
		if (clientSideErrors.errorMessage?.length > 0) {
			this.setState({
				submitting: true,
				clientSideErrors,
			});
		} else {
			this.setState({ saving: true });
			const isCreation = !this.state.indicator.id;

			const method = isCreation ? 'postIndicator' : 'putIndicator';
			return api[method](this.state.indicator)
				.then(
					(id = this.state.indicator.id) => {
						this.props.goBack(
							`/operations/indicator/${id}`,
							isCreation
						);
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

		const { frequencies, organisations, indicators, series } = this.props;
		const isUpdate = !!this.state.indicator.id;
		const indicator = {
			...this.state.indicator,
			seeAlso: (this.state.indicator.seeAlso || []).map((link) => link.id),
			contributors: (this.state.indicator.contributors || []).map(
				(link) => link.id
			),
			publishers: (this.state.indicator.publishers || []).map(
				(link) => link.id
			),
			wasGeneratedBy: (this.state.indicator.wasGeneratedBy || []).map(
				(link) => link.id
			),
			replaces: (this.state.indicator.replaces || []).map((link) => link.id),
			replacedBy: (this.state.indicator.isReplacedBy || []).map(
				(link) => link.id
			),
		};

		const organisationsOptions = ItemToSelectModel.toSelectModel(organisations);
		const seriesOptions = ItemToSelectModel.toSelectModel(series, 'series');
		const indicatorsOptions = ItemToSelectModel.toSelectModel(
			indicators.filter((s) => s.id !== indicator.id),
			'indicator'
		);
		const seriesAndIndicatorsOptions =
			ItemToSelectModel.mergedItemsToSelectModels(
				indicatorsOptions,
				seriesOptions
			);

		return (
			<div className="container editor-container">
				{isUpdate && (
					<PageTitleBlock
						titleLg1={indicator.prefLabelLg1}
						titleLg2={indicator.prefLabelLg2}
						secondLang={true}
					/>
				)}
				<Control
					onSubmit={this.onSubmit}
					disabled={this.state.clientSideErrors.errorMessage?.length > 0}
				/>
				{this.state.submitting && this.state.clientSideErrors && (
					<GlobalClientSideErrorBloc
						clientSideErrors={this.state.clientSideErrors.errorMessage}
						D={D}
					/>
				)}
				{this.state.serverSideError && (
					<ErrorBloc error={this.state.serverSideError} D={D} />
				)}

				<form>
					<h4 className="text-center">
						( <RequiredIcon /> : {D.requiredFields})
					</h4>
					<div className="row">
						<InputRmes
							colMd={6}
							value={indicator.prefLabelLg1}
							label={D1.title}
							star
							handleChange={this.onChanges.prefLabelLg1}
							arias={{
								'aria-invalid':
									!!this.state.clientSideErrors.fields?.prefLabelLg1,
								'aria-describedby': !!this.state.clientSideErrors.fields
									?.prefLabelLg1
									? 'prefLabelLg1-error'
									: null,
							}}
							className="w-100"
							errorBlock={
								<ClientSideError
									id="prefLabelLg1-error"
									error={this.state.clientSideErrors?.fields?.prefLabelLg1}
								></ClientSideError>
							}
						/>
						<InputRmes
							colMd={6}
							value={indicator.prefLabelLg2}
							label={D2.title}
							star
							handleChange={this.onChanges.prefLabelLg2}
							arias={{
								'aria-invalid':
									!!this.state.clientSideErrors.fields?.prefLabelLg2,
								'aria-describedby': !!this.state.clientSideErrors.fields
									?.prefLabelLg2
									? 'prefLabelLg2-error'
									: null,
							}}
							className="w-100"
							errorBlock={
								<ClientSideError
									id="prefLabelLg2-error"
									error={this.state.clientSideErrors?.fields?.prefLabelLg2}
								></ClientSideError>
							}
						/>
					</div>
					<div className="row">
						<InputRmes
							colMd={6}
							value={indicator.altLabelLg1}
							label={D1.altLabel}
							handleChange={this.onChanges.altLabelLg1}
							className="w-100"
						/>
						<InputRmes
							colMd={6}
							value={indicator.altLabelLg2}
							label={D2.altLabel}
							handleChange={this.onChanges.altLabelLg2}
							className="w-100"
						/>
					</div>
					<div className="row">
						<div className="form-group col-md-6">
							<label htmlFor="abstractLg1">{D1.summary}</label>
							<EditorMarkdown
								text={indicator.abstractLg1}
								handleChange={this.onChanges.abstractLg1}
							/>
						</div>
						<div className="form-group col-md-6">
							<label htmlFor="abstractLg2">{D2.summary}</label>
							<EditorMarkdown
								text={indicator.abstractLg2}
								handleChange={this.onChanges.abstractLg2}
							/>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-6">
							<label htmlFor="historyNoteLg1">{D1.history}</label>
							<EditorMarkdown
								text={indicator.historyNoteLg1}
								handleChange={this.onChanges.historyNoteLg1}
							/>
						</div>
						<div className="form-group col-md-6">
							<label htmlFor="historyNoteLg2">{D2.history}</label>
							<EditorMarkdown
								text={indicator.historyNoteLg2}
								handleChange={this.onChanges.historyNoteLg2}
							/>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label htmlFor="accrualPeriodicity" className="w-100">
								{D1.indicatorDataCollectFrequency}
								<SelectRmes
									placeholder=""
									unclearable
									value={indicator.accrualPeriodicityCode}
									options={frequencies?.codes?.map((cat) => {
										return { value: cat.code, label: cat.labelLg1 };
									})}
									onChange={this.onChange('accrualPeriodicityCode')}
								/>
							</label>
						</div>
					</div>

					<div className="row">
						<div className="form-group col-md-12">
							<PublishersInput
								value={indicator.publishers}
								onChange={(value) => this.onChange('publishers')(value)}
							/>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<CreatorsInput
								value={indicator.creators}
								onChange={(value) => this.onChange('creators')(value)}
							/>
							<ClientSideError
								id="creators-error"
								error={this.state.clientSideErrors?.fields?.creators}
							></ClientSideError>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label className="w-100">
								{D1.stakeholders}
								<SelectRmes
									unclearable
									value={indicator.contributors}
									options={organisationsOptions}
									placeholder=""
									multi
									onChange={(value) =>
										this.onChange('contributors')(
											value.map((v) => {
												return { id: v.value };
											})
										)
									}
								/>
							</label>
						</div>
					</div>

					<div className="row">
						<div className="form-group col-md-12">
							<label className="w-100">
								{D1.replaces}
								<SelectRmes
									unclearable
									value={indicator.replaces}
									options={indicatorsOptions}
									placeholder=""
									onChange={(value) =>
										this.onChange('replaces')(
											value.map((v) => {
												return { id: v.value, type: v.type };
											})
										)
									}
									multi
								/>
							</label>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label className="w-100">
								{D1.replacedBy}
								<SelectRmes
									unclearable
									value={indicator.replacedBy}
									options={indicatorsOptions}
									placeholder=""
									onChange={(value) =>
										this.onChange('isReplacedBy')(
											value.map((v) => {
												return { id: v.value, type: v.type };
											})
										)
									}
									multi
								/>
							</label>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label className="w-100">
								{D1.generatedBy}
								<SelectRmes
									unclearable
									value={indicator.wasGeneratedBy}
									options={seriesOptions}
									multi
									placeholder=""
									onChange={(value) =>
										this.onChange('wasGeneratedBy')(
											value.map((v) => {
												return { id: v.value, type: v.type };
											})
										)
									}
								/>
							</label>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label htmlFor="seeAlso" className="w-100">
								{D1.seeAlso}
								<SelectRmes
									unclearable
									value={indicator.seeAlso}
									options={seriesAndIndicatorsOptions}
									placeholder=""
									onChange={(value) =>
										this.onChange('seeAlso')(
											value.map((v) => {
												return { id: v.value, type: v.type };
											})
										)
									}
									multi
								/>
							</label>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export default withTitle(
	OperationsIndicatorEdition,
	D.operationsTitle,
	(props) => {
		return props.indicator?.prefLabelLg1 || D.indicatorsCreateTitle;
	}
);
