import { Component } from 'react';

import { CreatorsInput } from '@components/creators-input';
import {
	ClientSideError,
	ErrorBloc,
	GlobalClientSideErrorBloc,
} from '@components/errors-bloc';
import { InputRmes } from '@components/input-rmes';
import { Row } from '@components/layout';
import { Saving } from '@components/loading';
import { PageTitleBlock } from '@components/page-title-block';
import { RequiredIcon } from '@components/required-icon';
import { Select } from '@components/select-rmes';

import { OperationsApi } from '@sdk/operations-api';

import * as ItemToSelectModel from '@utils/item-to-select-model';

import { EditorMarkdown } from '../../../components/rich-editor/editor-markdown';
import D, { D1, D2 } from '../../../deprecated-locales';
import PublishersInput from '../../../modules-operations/components/publishers-input';
import Control from '../../../modules-operations/indicators/edition/control';
import { validate } from '../../../modules-operations/indicators/edition/validation';
import { CL_FREQ } from '../../../redux/actions/constants/codeList';

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
			{},
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
					...state.indicator,
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
			const method = isCreation ? 'createIndicator' : 'updateIndicator';
			return OperationsApi[method](this.state.indicator)
				.then(
					(id = this.state.indicator.id) => {
						this.props.goBack(`/operations/indicator/${id}`, isCreation);
					},
					(err) => {
						this.setState({
							serverSideError: err,
						});
					},
				)
				.finally(() => this.setState({ saving: false }));
		}
	};

	render() {
		if (this.state.saving) return <Saving />;

		const { frequencies, organisations, indicators, series } = this.props;

		const isUpdate = !!this.state.indicator.id;

		const indicator = {
			...this.state.indicator,
			seeAlso: (this.state.indicator.seeAlso || []).map((link) => link.id),
			contributors: (this.state.indicator.contributors || []).map(
				(link) => link.id,
			),
			publishers: (this.state.indicator.publishers || []).map(
				(link) => link.id,
			),
			wasGeneratedBy: (this.state.indicator.wasGeneratedBy || []).map(
				(link) => link.id,
			),
			replaces: (this.state.indicator.replaces || []).map((link) => link.id),
			replacedBy: (this.state.indicator.isReplacedBy || []).map(
				(link) => link.id,
			),
		};

		const organisationsOptions = ItemToSelectModel.toSelectModel(organisations);

		const seriesOptions = ItemToSelectModel.toSelectModel(series, 'series');

		const indicatorsOptions = ItemToSelectModel.toSelectModel(
			indicators.filter((s) => s.id !== indicator.id),
			'indicator',
		);

		const seriesAndIndicatorsOptions =
			ItemToSelectModel.mergedItemsToSelectModels(
				indicatorsOptions,
				seriesOptions,
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
					<Row>
						<InputRmes
							colMd={6}
							value={indicator.prefLabelLg1}
							label={D1.title}
							star
							handleChange={this.onChanges.prefLabelLg1}
							arias={{
								'aria-invalid':
									!!this.state.clientSideErrors.fields?.prefLabelLg1,
								'aria-describedby': this.state.clientSideErrors.fields
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
								'aria-describedby': this.state.clientSideErrors.fields
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
					</Row>
					<Row>
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
					</Row>
					<Row>
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
					</Row>
					<Row>
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
					</Row>
					<Row>
						<div className="form-group col-md-12">
							<label htmlFor="accrualPeriodicity" className="w-100">
								{D1.indicatorDataCollectFrequency}
								<Select
									placeholder=""
									value={indicator.accrualPeriodicityCode}
									options={frequencies?.codes?.map((cat) => {
										return { value: cat.code, label: cat.labelLg1 };
									})}
									onChange={this.onChange('accrualPeriodicityCode')}
								/>
							</label>
						</div>
					</Row>
					<Row>
						<div className="form-group col-md-12">
							<PublishersInput
								value={indicator.publishers}
								onChange={(value) => this.onChange('publishers')(value)}
							/>
						</div>
					</Row>
					<Row>
						<div className="form-group col-md-12">
							<CreatorsInput
								value={indicator.creators}
								onChange={(value) => this.onChange('creators')(value)}
								multi
							/>
							<ClientSideError
								id="creators-error"
								error={this.state.clientSideErrors?.fields?.creators}
							></ClientSideError>
						</div>
					</Row>
					<Row>
						<div className="form-group col-md-12">
							<label className="w-100">
								{D1.stakeholders}
								<Select
									value={indicator.contributors}
									options={organisationsOptions}
									placeholder=""
									multi
									onChange={(value) =>
										this.onChange('contributors')(
											value.map((v) => {
												return { id: v.value };
											}),
										)
									}
								/>
							</label>
						</div>
					</Row>
					<Row>
						<div className="form-group col-md-12">
							<label className="w-100">
								{D1.replaces}
								<Select
									value={indicator.replaces}
									options={indicatorsOptions}
									placeholder=""
									onChange={(value) =>
										this.onChange('replaces')(
											value.map((v) => {
												return { id: v.value, type: v.type };
											}),
										)
									}
									multi
								/>
							</label>
						</div>
					</Row>
					<Row>
						<div className="form-group col-md-12">
							<label className="w-100">
								{D1.replacedBy}
								<Select
									value={indicator.replacedBy}
									options={indicatorsOptions}
									placeholder=""
									onChange={(value) =>
										this.onChange('isReplacedBy')(
											value.map((v) => {
												return { id: v.value, type: v.type };
											}),
										)
									}
									multi
								/>
							</label>
						</div>
					</Row>
					<Row>
						<div className="form-group col-md-12">
							<label className="w-100">
								{D1.generatedBy}
								<Select
									value={indicator.wasGeneratedBy}
									options={seriesOptions}
									multi
									placeholder=""
									onChange={(value) =>
										this.onChange('wasGeneratedBy')(
											value.map((v) => {
												return { id: v.value, type: v.type };
											}),
										)
									}
								/>
							</label>
						</div>
					</Row>
					<Row>
						<div className="form-group col-md-12">
							<label htmlFor="seeAlso" className="w-100">
								{D1.seeAlso}
								<Select
									value={indicator.seeAlso}
									options={seriesAndIndicatorsOptions}
									placeholder=""
									onChange={(value) =>
										this.onChange('seeAlso')(
											value.map((v) => {
												return { id: v.value, type: v.type };
											}),
										)
									}
									multi
								/>
							</label>
						</div>
					</Row>
				</form>
			</div>
		);
	}
}

export default OperationsIndicatorEdition;
