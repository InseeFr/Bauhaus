import D, { D1, D2 } from '../../../deprecated-locales';
import { Component } from 'react';
import {
	Loading,
	ErrorBloc,
	GlobalClientSideErrorBloc,
	ClientSideError,
	TextInput,
	CreatorsInput,
	PageTitleBlock,
	EditorMarkdown,
	Select,
	Row,
} from '../../../components';

import PublishersInput from '../../../modules-operations/components/publishers-input';
import { isMandatoryField, validate } from './validation';
import * as ItemToSelectModel from '../../../utils/item-to-select-model';
import { OperationsApi } from '../../../sdk/operations-api';
import {
	CL_FREQ,
	CL_SOURCE_CATEGORY,
} from '../../../redux/actions/constants/codeList';
import LabelRequired from '../../../components/label-required';
import { ActionToolbar } from '../../../components/action-toolbar';
import {
	CancelButton,
	SaveButton,
} from '../../../components/buttons/buttons-with-icons';

const defaultSerie = {
	id: '',
	prefLabelLg1: '',
	prefLabelLg2: '',
	altLabelLg1: '',
	altLabelLg2: '',
	abstractLg1: '',
	abstractLg2: '',
	historyNoteLg1: '',
	historyNoteLg2: '',
	accrualPeriodicityList: CL_FREQ,
	typeList: CL_SOURCE_CATEGORY,
};

class OperationsSerieEdition extends Component {
	static defaultProps = {
		organisation: [],
		indicators: [],
		series: [],
	};

	constructor(props) {
		super(props);
		this.state = this.setInitialState(props);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.serie.id !== this.props.serie.id) {
			this.setState(this.setInitialState(nextProps));
		}
	}

	setInitialState = (props) => {
		return {
			serverSideError: '',
			clientSideErrors: {},
			submitting: false,
			saving: false,
			serie: {
				...defaultSerie,
				...props.serie,
			},
		};
	};

	onChange = (e) => {
		let override = {
			[e.target.id]: e.target.value,
		};
		if (e.target.id === 'idFamily') {
			override = {
				family: {
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
			serie: {
				...state.serie,
				...override,
			},
		}));
	};

	onSubmit = () => {
		const clientSideErrors = validate(this.state.serie);
		if (clientSideErrors.errorMessage?.length > 0) {
			this.setState({
				submitting: true,
				clientSideErrors,
			});
		} else {
			this.setState({ saving: true });
			const isCreation = !this.state.serie.id;

			const method = isCreation ? 'postSeries' : 'putSeries';
			return OperationsApi[method](this.state.serie)
				.then(
					(id = this.state.serie.id) => {
						this.props.goBack(`/operations/series/${id}`, isCreation);
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
		if (this.state.saving) return <Loading textType="saving" />;

		const {
			frequencies,
			categories,
			organisations,
			indicators,
			series,
			goBack,
		} = this.props;

		const serie = {
			...this.state.serie,
			seeAlso: (this.state.serie.seeAlso || []).map((link) => link.id),
			contributors: (this.state.serie.contributors || []).map(
				(link) => link.id,
			),
			dataCollectors: (this.state.serie.dataCollectors || []).map(
				(link) => link.id,
			),
			publishers: (this.state.serie.publishers || []).map(
				(publisher) => publisher.id,
			),
			replaces: (this.state.serie.replaces || []).map((link) => link.id),
			replacedBy: (this.state.serie.isReplacedBy || []).map((link) => link.id),
			generate: (this.state.serie.generate || []).map((link) => link.id),
		};

		const familiesOptions = this.props.families.map((s) => {
			return { value: s.id, label: s.label };
		});

		const family = serie.family || { id: '' };

		const isEditing = !!serie.id;

		const organisationsOptions = ItemToSelectModel.toSelectModel(organisations);

		const seriesOptions = ItemToSelectModel.toSelectModel(
			series.filter((s) => s.id !== serie.id),
			'series',
		);

		const indicatorsOptions = ItemToSelectModel.toSelectModel(
			indicators,
			'indicator',
		);

		const seriesAndIndicatorsOptions =
			ItemToSelectModel.mergedItemsToSelectModels(
				indicatorsOptions,
				seriesOptions,
			);

		const serverSideError = this.state.serverSideError;

		return (
			<div className="container editor-container">
				{isEditing && (
					<PageTitleBlock
						titleLg1={this.props.serie.prefLabelLg1}
						titleLg2={this.props.serie.prefLabelLg2}
						secondLang={true}
					/>
				)}
				<ActionToolbar>
					<CancelButton action={() => goBack('/operations/series')} />
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
				{serverSideError && <ErrorBloc error={[serverSideError]} D={D} />}
				<form>
					{!isEditing && (
						<Row>
							<div className="form-group col-md-12">
								<LabelRequired>{D.familyTitle}</LabelRequired>
								<Select
									placeholder={D.familiesTitle}
									value={family.id}
									options={familiesOptions}
									onChange={(value) =>
										this.onChange({
											target: { value, id: 'idFamily' },
										})
									}
								/>
								<ClientSideError
									id="family-error"
									error={this.state.clientSideErrors?.fields?.family}
								></ClientSideError>
							</div>
						</Row>
					)}
					<Row>
						<div className="form-group col-md-6">
							<LabelRequired htmlFor="prefLabelLg1">{D1.title}</LabelRequired>
							<TextInput
								id="prefLabelLg1"
								value={serie.prefLabelLg1}
								onChange={this.onChange}
								aria-invalid={
									!!this.state.clientSideErrors.fields?.prefLabelLg1
								}
								aria-describedby={
									this.state.clientSideErrors.fields?.prefLabelLg1
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
								value={serie.prefLabelLg2}
								onChange={this.onChange}
								aria-invalid={
									!!this.state.clientSideErrors.fields?.prefLabelLg2
								}
								aria-describedby={
									this.state.clientSideErrors.fields?.prefLabelLg2
										? 'prefLabelLg2-error'
										: null
								}
							/>
							<ClientSideError
								id="prefLabelLg2-error"
								error={this.state.clientSideErrors?.fields?.prefLabelLg2}
							></ClientSideError>
						</div>
					</Row>
					<Row>
						<div className="form-group col-md-6">
							<label htmlFor="altLabelLg1">{D1.altLabel}</label>
							<TextInput
								id="altLabelLg1"
								value={serie.altLabelLg1}
								onChange={this.onChange}
							/>
						</div>
						<div className="form-group col-md-6">
							<label htmlFor="altLabel2">{D2.altLabel}</label>
							<TextInput
								id="altLabelLg2"
								value={serie.altLabelLg2}
								onChange={this.onChange}
							/>
						</div>
					</Row>
					<Row>
						<div className="form-group col-md-6">
							<label htmlFor="abstractLg1">{D1.summary}</label>
							<EditorMarkdown
								text={serie.abstractLg1}
								handleChange={(value) =>
									this.onChange({ target: { value, id: 'abstractLg1' } })
								}
							/>
						</div>
						<div className="form-group col-md-6">
							<label htmlFor="abstractLg2">{D2.summary}</label>
							<EditorMarkdown
								text={serie.abstractLg2}
								handleChange={(value) =>
									this.onChange({ target: { value, id: 'abstractLg2' } })
								}
							/>
						</div>
					</Row>
					<Row>
						<div className="form-group col-md-6">
							<label htmlFor="historyNoteLg1">{D1.history}</label>
							<EditorMarkdown
								text={serie.historyNoteLg1}
								handleChange={(value) =>
									this.onChange({ target: { value, id: 'historyNoteLg1' } })
								}
							/>
						</div>
						<div className="form-group col-md-6">
							<label htmlFor="historyNoteLg2">{D2.history}</label>
							<EditorMarkdown
								text={serie.historyNoteLg2}
								handleChange={(value) =>
									this.onChange({ target: { value, id: 'historyNoteLg2' } })
								}
							/>
						</div>
					</Row>
					<Row>
						<div className="form-group col-md-12">
							{isMandatoryField('typeCode') ? (
								<LabelRequired htmlFor="typeCode">
									{D1.operationType}
								</LabelRequired>
							) : (
								<label htmlFor="typeCode" className="w-100">
									{D1.operationType}
								</label>
							)}
							<Select
								placeholder=""
								value={serie.typeCode}
								options={categories?.codes?.map((cat) => {
									return { value: cat.code, label: cat.labelLg1 };
								})}
								onChange={(value) =>
									this.onChange({
										target: { value, id: 'typeCode' },
									})
								}
							/>
							<ClientSideError
								id="typeCode-error"
								error={this.state.clientSideErrors?.fields?.typeCode}
							></ClientSideError>
						</div>
					</Row>
					<Row>
						<div className="form-group col-md-12">
							{isMandatoryField('accrualPeriodicityCode') ? (
								<LabelRequired htmlFor="accrualPeriodicityCode">
									{D1.dataCollectFrequency}
								</LabelRequired>
							) : (
								<label htmlFor="accrualPeriodicityCode" className="w-100">
									{D1.dataCollectFrequency}
								</label>
							)}
							<Select
								placeholder=""
								value={serie.accrualPeriodicityCode}
								options={frequencies?.codes?.map((cat) => {
									return { value: cat.code, label: cat.labelLg1 };
								})}
								onChange={(value) =>
									this.onChange({
										target: { value, id: 'accrualPeriodicityCode' },
									})
								}
							/>
							<ClientSideError
								id="accrualPeriodicityCode-error"
								error={
									this.state.clientSideErrors?.fields?.accrualPeriodicityCode
								}
							></ClientSideError>
						</div>
					</Row>
					<Row>
						<div className="form-group col-md-12">
							<PublishersInput
								value={serie.publishers}
								onChange={(value) =>
									this.onChange({
										target: {
											value,
											id: 'publishers',
										},
									})
								}
							/>
						</div>
					</Row>
					<Row>
						<div className="form-group col-md-12">
							<label className="w-100">
								{D1.stakeholders}
								<Select
									placeholder=""
									value={serie.contributors}
									options={organisationsOptions}
									onChange={(value) =>
										this.onChange({
											target: {
												value: value.map((v) => {
													return { id: v.value };
												}),
												id: 'contributors',
											},
										})
									}
									multi
								/>
							</label>
						</div>
					</Row>
					<Row>
						<div className="form-group col-md-12">
							<label htmlFor="dataCollector" className="w-100">
								{D1.dataCollector}
								<Select
									placeholder=""
									value={serie.dataCollectors}
									options={organisationsOptions}
									onChange={(value) =>
										this.onChange({
											target: {
												value: value.map((v) => {
													return { id: v.value };
												}),
												id: 'dataCollectors',
											},
										})
									}
									multi
								/>
							</label>
						</div>
					</Row>
					<Row>
						<div className="form-group col-md-12">
							<CreatorsInput
								value={serie.creators}
								onChange={(value) =>
									this.onChange({
										target: {
											value,
											id: 'creators',
										},
									})
								}
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
							<label htmlFor="replaces" className="w-100">
								{D1.replaces}
								<Select
									placeholder=""
									value={serie.replaces}
									options={seriesOptions}
									onChange={(value) =>
										this.onChange({
											target: {
												value: value.map((v) => {
													return { id: v.value, type: v.type };
												}),
												id: 'replaces',
											},
										})
									}
									multi
								/>
							</label>
						</div>
					</Row>
					<Row>
						<div className="form-group col-md-12">
							<label htmlFor="replacedBy" className="w-100">
								{D1.replacedBy}
								<Select
									placeholder=""
									value={serie.replacedBy}
									options={seriesOptions}
									onChange={(value) =>
										this.onChange({
											target: {
												value: value.map((v) => {
													return { id: v.value, type: v.type };
												}),
												id: 'isReplacedBy',
											},
										})
									}
									multi
								/>
							</label>
						</div>
					</Row>
					<Row>
						<div className="form-group col-md-12">
							<label htmlFor="indicators" className="w-100">
								{D1.indicators}
								<Select
									placeholder=""
									value={serie.generate}
									options={indicatorsOptions}
									disabled
									multi
									onChange={() => {}}
								/>
							</label>
						</div>
					</Row>
					<Row>
						<div className="form-group col-md-12">
							<label htmlFor="seeAlso" className="w-100">
								{D1.seeAlso}
								<Select
									placeholder=""
									value={serie.seeAlso}
									options={seriesAndIndicatorsOptions}
									onChange={(value) =>
										this.onChange({
											target: {
												value: value.map((v) => {
													return { id: v.value, type: v.type };
												}),
												id: 'seeAlso',
											},
										})
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

export default OperationsSerieEdition;
