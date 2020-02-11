import D, { D1, D2 } from 'js/i18n';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { goBack, goBackOrReplace } from '@inseefr/ui/src/utils/redirection';
import {
	Loading,
	CancelButton,
	SaveButton,
	ErrorBloc,
	ActionToolbar,
} from '@inseefr/ui';
import SelectRmes from 'js/applications/shared/select-rmes';
import { CL_SOURCE_CATEGORY, CL_FREQ } from 'js/actions/constants/codeList';
import EditorMarkdown from 'js/applications/shared/editor-html/editor-markdown';

import { validate } from './validation';

import {
	toSelectModel,
	mergedItemsToSelectModels,
} from 'js/applications/operations/shared/utils/itemToSelectModel';
import PageTitleBlock from 'js/applications/shared/page-title-block';

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
	static propTypes = {
		serie: PropTypes.object.isRequired,
		langs: PropTypes.object.isRequired,
		saveSerie: PropTypes.func.isRequired,
		categories: PropTypes.object.isRequired,
		frequencies: PropTypes.object.isRequired,

		organisation: PropTypes.array.isRequired,
		indicators: PropTypes.array.isRequired,
		series: PropTypes.array.isRequired,
		stamps: PropTypes.arrayOf(PropTypes.string),
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

	setInitialState = props => {
		return {
			serverSideError: '',
			serie: {
				...defaultSerie,
				...props.serie,
			},
		};
	};

	onChange = e => {
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
		this.setState({
			serverSideError: '',
			serie: {
				...this.state.serie,
				...override,
			},
		});
	};
	onSubmit = () => {
		const isCreation = !this.state.serie.id;

		this.props.saveSerie(this.state.serie, (err, id = this.props.serie.id) => {
			if (!err) {
				goBackOrReplace(this.props, `/operations/series/${id}`, isCreation);
			} else {
				this.setState({
					serverSideError: err,
				});
			}
		});
	};

	render() {
		if (this.props.operationsAsyncTask) return <Loading textType="saving" />;

		const {
			frequencies,
			categories,
			organisations,
			indicators,
			series,
			stamps,
		} = this.props;

		const serie = {
			...this.state.serie,
			seeAlso: (this.state.serie.seeAlso || []).map(link => link.id),
			contributor: (this.state.serie.contributor || []).map(link => link.id),
			dataCollector: (this.state.serie.dataCollector || []).map(
				link => link.id
			),
			replaces: (this.state.serie.replaces || []).map(link => link.id),
			replacedBy: (this.state.serie.isReplacedBy || []).map(link => link.id),
			generate: (this.state.serie.generate || []).map(link => link.id),
		};
		const familiesOptions = this.props.families.map(s => {
			return { value: s.id, label: s.label };
		});
		const family = serie.family || { id: '' };

		const isEditing = !!serie.id;

		const stampsOptions = stamps.map(stamp => ({
			value: stamp,
			label: stamp,
		}));

		const organisationsOptions = toSelectModel(organisations);
		const seriesOptions = toSelectModel(
			series.filter(s => s.id !== serie.id),
			'series'
		);
		const indicatorsOptions = toSelectModel(indicators, 'indicator');
		const seriesAndIndicatorsOptions = mergedItemsToSelectModels(
			indicatorsOptions,
			seriesOptions
		);

		const errors = validate(serie);
		const globalError = errors.errorMessage || this.state.serverSideError;

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
					<CancelButton action={goBack(this.props, '/operations/series')} />
					<SaveButton action={this.onSubmit} disabled={errors.errorMessage} />
				</ActionToolbar>
				<ErrorBloc error={globalError} />

				<form>
					{!isEditing && (
						<div className="row">
							<div className="form-group col-md-12">
								<SelectRmes
									placeholder={D.familiesTitle}
									unclearable
									value={family.id}
									options={familiesOptions}
									onChange={value =>
										this.onChange({
											target: { value, id: 'idFamily' },
										})
									}
								/>
							</div>
						</div>
					)}
					<div className="row">
						<div className="form-group col-md-6">
							<label htmlFor="prefLabelLg1">
								{D1.title}
								<span className="boldRed">*</span>
							</label>
							<input
								type="text"
								className="form-control"
								id="prefLabelLg1"
								value={serie.prefLabelLg1}
								onChange={this.onChange}
								aria-invalid={errors.fields.prefLabelLg1}
							/>
						</div>
						<div className="form-group col-md-6">
							<label htmlFor="prefLabelLg2">
								{D2.title}
								<span className="boldRed">*</span>
							</label>
							<input
								type="text"
								className="form-control"
								id="prefLabelLg2"
								value={serie.prefLabelLg2}
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
								value={serie.altLabelLg1}
								onChange={this.onChange}
							/>
						</div>
						<div className="form-group col-md-6">
							<label htmlFor="altLabel2">{D2.altLabel}</label>
							<input
								type="text"
								className="form-control"
								id="altLabelLg2"
								value={serie.altLabelLg2}
								onChange={this.onChange}
							/>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-6">
							<label htmlFor="abstractLg1">{D1.summary}</label>
							<EditorMarkdown
								text={serie.abstractLg1}
								handleChange={value =>
									this.onChange({ target: { value, id: 'abstractLg1' } })
								}
							/>
						</div>
						<div className="form-group col-md-6">
							<label htmlFor="abstractLg2">{D2.summary} ></label>
							<EditorMarkdown
								text={serie.abstractLg2}
								handleChange={value =>
									this.onChange({ target: { value, id: 'abstractLg2' } })
								}
							/>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-6">
							<label htmlFor="historyNoteLg1">{D1.history}</label>
							<EditorMarkdown
								text={serie.historyNoteLg1}
								handleChange={value =>
									this.onChange({ target: { value, id: 'historyNoteLg1' } })
								}
							/>
						</div>
						<div className="form-group col-md-6">
							<label htmlFor="historyNoteLg2">{D2.history}</label>
							<EditorMarkdown
								text={serie.historyNoteLg2}
								handleChange={value =>
									this.onChange({ target: { value, id: 'historyNoteLg2' } })
								}
							/>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label htmlFor="typeOperation" className="full-label">
								{D1.operationType}
								<SelectRmes
									placeholder=""
									unclearable
									value={serie.typeCode}
									options={categories.codes.map(cat => {
										return { value: cat.code, label: cat.labelLg1 };
									})}
									onChange={value =>
										this.onChange({
											target: { value, id: 'typeCode' },
										})
									}
								/>
							</label>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label htmlFor="accrualPeriodicity" className="full-label">
								{D1.dataCollectFrequency}
								<SelectRmes
									placeholder=""
									unclearable
									value={serie.accrualPeriodicityCode}
									options={frequencies.codes.map(cat => {
										return { value: cat.code, label: cat.labelLg1 };
									})}
									onChange={value =>
										this.onChange({
											target: { value, id: 'accrualPeriodicityCode' },
										})
									}
								/>
							</label>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label htmlFor="creator" className="full-label">
								{D1.organisation}
								<SelectRmes
									placeholder=""
									unclearable
									value={serie.creator}
									options={organisationsOptions}
									onChange={value =>
										this.onChange({ target: { value, id: 'creator' } })
									}
								/>
							</label>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label className="full-label">
								{D1.stakeholders}
								<SelectRmes
									placeholder=""
									unclearable
									value={serie.contributor}
									options={organisationsOptions}
									onChange={value =>
										this.onChange({
											target: {
												value: value.map(v => {
													return { id: v.value };
												}),
												id: 'contributor',
											},
										})
									}
									multi
								/>
							</label>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label htmlFor="dataCollector" className="full-label">
								{D1.dataCollector}
								<SelectRmes
									placeholder=""
									unclearable
									value={serie.dataCollector}
									options={organisationsOptions}
									onChange={value =>
										this.onChange({
											target: {
												value: value.map(v => {
													return { id: v.value };
												}),
												id: 'dataCollector',
											},
										})
									}
									multi
								/>
							</label>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label htmlFor="contributor" className="full-label">
								{D1.operationsContributorTitle}
								<SelectRmes
									placeholder=""
									unclearable
									value={serie.gestionnaire}
									options={stampsOptions}
									onChange={value =>
										this.onChange({ target: { value, id: 'gestionnaire' } })
									}
								/>
							</label>
						</div>
					</div>

					<div className="row">
						<div className="form-group col-md-12">
							<label htmlFor="replaces" className="full-label">
								{D1.replaces}
								<SelectRmes
									placeholder=""
									unclearable
									value={serie.replaces}
									options={seriesOptions}
									onChange={value =>
										this.onChange({
											target: {
												value: value.map(v => {
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
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label htmlFor="replacedBy" className="full-label">
								{D1.replacedBy}
								<SelectRmes
									placeholder=""
									unclearable
									value={serie.replacedBy}
									options={seriesOptions}
									onChange={value =>
										this.onChange({
											target: {
												value: value.map(v => {
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
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label htmlFor="indicators" className="full-label">
								{D1.indicators}
								<SelectRmes
									placeholder=""
									unclearable
									value={serie.generate}
									options={indicatorsOptions}
									disabled
									multi
									onChange={() => {}}
								/>
							</label>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label htmlFor="seeAlso" className="full-label">
								{D1.seeAlso}
								<SelectRmes
									unclearable
									placeholder=""
									value={serie.seeAlso}
									options={seriesAndIndicatorsOptions}
									onChange={value =>
										this.onChange({
											target: {
												value: value.map(v => {
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
					</div>
				</form>
			</div>
		);
	}
}

export default OperationsSerieEdition;
