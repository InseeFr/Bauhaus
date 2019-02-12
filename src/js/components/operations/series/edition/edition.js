import React, { Component } from 'react';
import PageSubtitle from 'js/components/shared/page-subtitle';
import PageTitle from 'js/components/shared/page-title';
import D from 'js/i18n';
import { goBack } from 'js/utils/redirection';
import NoteFlag from 'js/components/shared/note-flag';
import PropTypes from 'prop-types';
import EditorMarkdown from 'js/components/shared/editor-markdown';
import Button from 'js/components/shared/button';
import { CL_SOURCE_CATEGORY, CL_FREQ } from 'js/actions/constants/codeList';
import SelectRmes from 'js/components/shared/select-rmes';
import {
	toSelectModel,
	mergedItemsToSelectModels,
} from 'js/components/operations/shared/utils/itemToSelectModel';

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
	};

	constructor(props) {
		super(props);
		this.state = {
			serie: {
				...defaultSerie,
				...props.serie,
			},
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			serie: {
				...defaultSerie,
				...nextProps.serie,
			},
		});
	}
	onChange(e) {
		this.setState({
			serie: {
				...this.state.serie,
				[e.target.id]: e.target.value,
			},
		});
	}
	onSubmit() {
		this.props.saveSerie(this.state.serie, () => {
			goBack(this.props, '/operations/series/' + this.state.serie.id)();
		});
	}

	render() {
		const {
			langs: { lg1, lg2 },
			frequencies,
			categories,
			organisations,
			indicators,
			series,
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
		const isEditing = !!serie.id;

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
		return (
			<div className="container editor-container">
				{isEditing && (
					<>
						<PageTitle
							title={this.props.serie.prefLabelLg1}
							context="operations"
						/>
						{serie.prefLabelLg2 && (
							<PageSubtitle
								subTitle={this.props.serie.prefLabelLg2}
								context="operations"
							/>
						)}
					</>
				)}

				<div className="row btn-line">
					<Button
						className="col-md-2"
						action={goBack(this.props, '/operations/series')}
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
						className="col-md-2"
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
					{!isEditing && (
						<div className="row">
							<div className="form-group col-md-12">
								<SelectRmes
									placeholder={D.familiesTitle}
									unclearable
									value={serie.typeCode}
									options={[]}
									onChange={value =>
										this.onChange({
											target: { value, id: 'typeCode' },
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
							</label>
							<input
								type="text"
								className="form-control"
								id="prefLabelLg1"
								value={serie.prefLabelLg1}
								onChange={this.onChange}
								disabled={isEditing}
							/>
						</div>
						<div className="form-group col-md-6">
							<label htmlFor="prefLabelLg2">
								<NoteFlag text={D.title} lang={lg2} />
							</label>
							<input
								type="text"
								className="form-control"
								id="prefLabelLg2"
								value={serie.prefLabelLg2}
								onChange={this.onChange}
								disabled={isEditing}
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
								value={serie.altLabelLg1}
								onChange={this.onChange}
							/>
						</div>
						<div className="form-group col-md-6">
							<label htmlFor="altLabel2">
								<NoteFlag text={D.altLabel} lang={lg2} />
							</label>
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
							<label htmlFor="abstractLg1">
								<NoteFlag text={D.summary} lang={lg1} />
							</label>
							<EditorMarkdown
								text={serie.abstractLg1}
								handleChange={value =>
									this.onChange({ target: { value, id: 'abstractLg1' } })
								}
							/>
						</div>
						<div className="form-group col-md-6">
							<label htmlFor="abstractLg2">
								<NoteFlag text={D.summary} lang={lg2} />
							</label>
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
							<label htmlFor="historyNoteLg1">
								<NoteFlag text={D.history} lang={lg1} />
							</label>
							<EditorMarkdown
								text={serie.historyNoteLg1}
								handleChange={value =>
									this.onChange({ target: { value, id: 'historyNoteLg1' } })
								}
							/>
						</div>
						<div className="form-group col-md-6">
							<label htmlFor="historyNoteLg2">
								<NoteFlag text={D.history} lang={lg2} />
							</label>
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
								{D.operationType}
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
								{D.dataCollectFrequency}
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
								{D.organisation}
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
								{D.stakeholders}
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
								{D.dataCollector}
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
								{D.operationsContributorTitle}
								<SelectRmes
									placeholder=""
									unclearable
									value={serie.gestionnaire}
									options={organisationsOptions}
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
								{D.replaces}
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
								{D.replacedBy}
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
								{D.indicators}
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
								{D.seeAlso}
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
