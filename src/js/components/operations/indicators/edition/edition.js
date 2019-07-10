import React, { Component } from 'react';
import PageSubtitle from 'js/components/shared/page-subtitle';
import PageTitle from 'js/components/shared/page-title';
import D from 'js/i18n';
import NoteFlag from 'js/components/shared/note-flag/note-flag';
import PropTypes from 'prop-types';
import EditorMarkdown from 'js/components/shared/editor-html/editor-markdown';
import { CL_FREQ } from 'js/actions/constants/codeList';
import InputRmes from 'js/components/shared/input-rmes';
import Control from 'js/components/operations/indicators/edition/control';
import SelectRmes from 'js/components/shared/select-rmes';
import {
	toSelectModel,
	mergedItemsToSelectModels,
} from 'js/components/operations/shared/utils/itemToSelectModel';
import { validate } from 'js/components/operations/indicators/edition/validation';
import Loading from 'js/components/shared/loading';

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
			'creator',
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

	setInitialState = props => {
		return {
			serverSideError: '',
			indicator: {
				...defaultIndicator,
				...props.indicator,
			},
		};
	};

	onChange = selector => {
		return value => {
			this.setState({
				serverSideError: '',
				indicator: {
					...this.state.indicator,
					[selector]: value,
				},
			});
		};
	};

	onSubmit = () => {
		this.props.saveIndicator(this.state.indicator, (err, id) => {
			if (!err) {
				this.props.history.push(`/operations/indicator/${id}`);
			} else {
				this.setState({
					serverSideError: err,
				});
			}
		});
	};

	render() {
		if (this.props.operationsAsyncTask)
			return <Loading textType="saving" context="operations" />;

		const {
			langs: { lg1, lg2 },
			frequencies,
			organisations,
			indicators,
			series,
		} = this.props;
		const isUpdate = !!this.state.indicator.id;
		const indicator = {
			...this.state.indicator,
			seeAlso: (this.state.indicator.seeAlso || []).map(link => link.id),
			contributor: (this.state.indicator.contributor || []).map(
				link => link.id
			),
			wasGeneratedBy: (this.state.indicator.wasGeneratedBy || []).map(
				link => link.id
			),
			replaces: (this.state.indicator.replaces || []).map(link => link.id),
			replacedBy: (this.state.indicator.isReplacedBy || []).map(
				link => link.id
			),
		};

		const organisationsOptions = toSelectModel(organisations);
		const seriesOptions = toSelectModel(series, 'series');
		const indicatorsOptions = toSelectModel(
			indicators.filter(s => s.id !== indicator.id),
			'indicator'
		);
		const seriesAndIndicatorsOptions = mergedItemsToSelectModels(
			indicatorsOptions,
			seriesOptions
		);
		const errors = validate(this.state.indicator);
		const globalError = errors.errorMessage || this.state.serverSideError;

		return (
			<div className="container editor-container">
				{isUpdate && (
					<React.Fragment>
						<PageTitle
							title={this.props.indicator.prefLabelLg1}
							context="operations"
						/>
						{indicator.prefLabelLg2 && (
							<PageSubtitle
								subTitle={this.props.indicator.prefLabelLg2}
								context="operations"
							/>
						)}
					</React.Fragment>
				)}
				<Control
					indicator={this.state.indicator}
					onSubmit={this.onSubmit}
					errorMessage={globalError}
				/>

				<form>
					<h4 className="centered">
						( <span className="boldRed">*</span> : {D.requiredFields})
					</h4>
					<div className="row">
						<InputRmes
							colMd={6}
							value={indicator.prefLabelLg1}
							label={D.title}
							lang={lg1}
							star
							handleChange={this.onChanges.prefLabelLg1}
							arias={{
								'aria-invalid': errors.fields.prefLabelLg1,
							}}
						/>
						<InputRmes
							colMd={6}
							value={indicator.prefLabelLg2}
							label={D.title}
							lang={lg2}
							star
							handleChange={this.onChanges.prefLabelLg2}
							arias={{
								'aria-invalid': errors.fields.prefLabelLg2,
							}}
						/>
					</div>
					<div className="row">
						<InputRmes
							colMd={6}
							value={indicator.altLabelLg1}
							label={D.altLabel}
							lang={lg1}
							handleChange={this.onChanges.altLabelLg1}
						/>
						<InputRmes
							colMd={6}
							value={indicator.altLabelLg2}
							label={D.altLabel}
							lang={lg2}
							handleChange={this.onChanges.altLabelLg2}
						/>
					</div>
					<div className="row">
						<div className="form-group col-md-6">
							<label htmlFor="abstractLg1">
								<NoteFlag text={D.summary} lang={lg1} />
							</label>
							<EditorMarkdown
								text={indicator.abstractLg1}
								handleChange={this.onChanges.abstractLg1}
							/>
						</div>
						<div className="form-group col-md-6">
							<label htmlFor="abstractLg2">
								<NoteFlag text={D.summary} lang={lg2} />
							</label>
							<EditorMarkdown
								text={indicator.abstractLg2}
								handleChange={this.onChanges.abstractLg2}
							/>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-6">
							<label htmlFor="historyNoteLg1">
								<NoteFlag text={D.history} lang={lg1} />
							</label>
							<EditorMarkdown
								text={indicator.historyNoteLg1}
								handleChange={this.onChanges.historyNoteLg1}
							/>
						</div>
						<div className="form-group col-md-6">
							<label htmlFor="historyNoteLg2">
								<NoteFlag text={D.history} lang={lg2} />
							</label>
							<EditorMarkdown
								text={indicator.historyNoteLg2}
								handleChange={this.onChanges.historyNoteLg2}
							/>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label htmlFor="accrualPeriodicity" className="full-label">
								{D.indicatorDataCollectFrequency}
								<SelectRmes
									placeholder=""
									unclearable
									value={indicator.accrualPeriodicityCode}
									options={frequencies.codes.map(cat => {
										return { value: cat.code, label: cat.labelLg1 };
									})}
									onChange={this.onChange('accrualPeriodicityCode')}
								/>
							</label>
						</div>
					</div>

					<div className="row">
						<div className="form-group col-md-12">
							<label htmlFor="creator" className="full-label">
								{D.organisation}

								<SelectRmes
									unclearable
									value={indicator.creator}
									options={organisationsOptions}
									placeholder=""
									onChange={this.onChanges.creator}
								/>
							</label>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label className="full-label">
								{D.stakeholders}
								<SelectRmes
									unclearable
									value={indicator.contributor}
									options={organisationsOptions}
									placeholder=""
									multi
									onChange={value =>
										this.onChange('contributor')(
											value.map(v => {
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
							<label className="full-label">
								{D.replaces}
								<SelectRmes
									unclearable
									value={indicator.replaces}
									options={indicatorsOptions}
									placeholder=""
									onChange={value =>
										this.onChange('replaces')(
											value.map(v => {
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
							<label className="full-label">
								{D.replacedBy}
								<SelectRmes
									unclearable
									value={indicator.replacedBy}
									options={indicatorsOptions}
									placeholder=""
									onChange={value =>
										this.onChange('isReplacedBy')(
											value.map(v => {
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
							<label className="full-label">
								{D.generatedBy}
								<SelectRmes
									unclearable
									value={indicator.wasGeneratedBy}
									options={seriesOptions}
									multi
									placeholder=""
									onChange={value =>
										this.onChange('wasGeneratedBy')(
											value.map(v => {
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
							<label htmlFor="seeAlso" className="full-label">
								{D.seeAlso}
								<SelectRmes
									unclearable
									value={indicator.seeAlso}
									options={seriesAndIndicatorsOptions}
									placeholder=""
									onChange={value =>
										this.onChange('seeAlso')(
											value.map(v => {
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

export default OperationsIndicatorEdition;
