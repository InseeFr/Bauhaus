import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import PageTitle from 'js/components/shared/page-title';
import Controls from './controls';
import SelectRmes from 'js/components/shared/select-rmes';
import DatePickerRmes from 'js/components/shared/date-picker-rmes';
import D from 'js/i18n';
import Pagination from 'js/components/shared/pagination';
import {
	filterKeyDeburr,
	filterKeyDate,
	nbResults,
} from 'js/utils/array-utils';

const filterLabel = filterKeyDeburr(['label']);
const filterAltLabel = filterKeyDeburr(['altLabel']);
const filterDefinition = filterKeyDeburr(['definition']);
const filterCreator = filterKeyDeburr(['creator']);
const filterDisseminationStatus = filterKeyDeburr(['disseminationStatus']);
const filterValidationStatus = filterKeyDeburr(['validationStatus']);
const filterCreatedDate = filterKeyDate(['created']);
const filterModifiedDate = filterKeyDate(['modified']);

const fields = [
	'label',
	'altLabel',
	'definition',
	'creator',
	'disseminationStatus',
	'validationStatus',
	'dateCreatedStart',
	'dateCreatedEnd',
	'dateModifiedStart',
	'dateModifiedEnd',
];

const handleFieldChange = handleChange =>
	fields.reduce((handlers, field) => {
		handlers[field] = value => handleChange({ [field]: value });
		return handlers;
	}, {});

//TODO fix confusion about naming between `ConceptsSearchList`,
//`ConceptsListSearch` and `SearchConceptsList`
class ConceptSearchList extends Component {
	constructor(props) {
		super(props);
		this.getEmptyState = () => ({
			hits: this.props.conceptSearchList,
			label: '',
			altLabel: '',
			definition: '',
			creator: '',
			dateCreatedStart: '',
			dateCreatedEnd: '',
			dateModifiedStart: '',
			dateModifiedEnd: '',
			disseminationStatus: '',
			validationStatus: '',
		});

		this.state = {
			askForReturn: false,
			...this.getEmptyState(),
		};

		this.initializeState = () => this.setState(this.getEmptyState());
		this.onClickReturn = () => {
			this.setState({
				askForReturn: true,
			});
		};

		this.handleChange = stateChange => {
			const newState = Object.assign(this.state, stateChange);
			const {
				label,
				altLabel,
				definition,
				creator,
				disseminationStatus,
				validationStatus,
				dateCreatedStart,
				dateCreatedEnd,
				dateModifiedStart,
				dateModifiedEnd,
			} = newState;
			const hits = this.props.conceptSearchList
				.filter(filterLabel(label))
				.filter(filterAltLabel(altLabel))
				.filter(filterDefinition(definition))
				.filter(filterCreator(creator))
				.filter(filterDisseminationStatus(disseminationStatus))
				.filter(filterValidationStatus(validationStatus))
				.filter(filterCreatedDate(dateCreatedStart, dateCreatedEnd))
				.filter(filterModifiedDate(dateModifiedStart, dateModifiedEnd));
			//TODO might need further thinking. For now, I think it's the best way of
			//updating the state. We could also have used a callback to process hits,
			//or passing `newState` to `setState`.
			this.setState(Object.assign(stateChange, { hits }));
		};

		this.handlers = handleFieldChange(this.handleChange);
	}

	render() {
		if (this.state.askForReturn) return <Redirect to="/concepts" push />;
		const { stampList, disseminationStatusList } = this.props;
		const {
			label,
			altLabel,
			definition,
			creator,
			disseminationStatus,
			validationStatus,
			dateCreatedStart,
			dateCreatedEnd,
			dateModifiedStart,
			dateModifiedEnd,
			hits,
		} = this.state;

		const hitEls = hits.map(({ id, label }) => (
			<li key={id} className="list-group-item">
				<Link to={`/concept/${id}`}>{label}</Link>
			</li>
		));

		return (
			<div>
				<div className="container">
					<PageTitle title={D.conceptSearchTitle} />
					<Controls
						onClickReturn={this.onClickReturn}
						initializeState={this.initializeState}
					/>
					<div className="row form-group">
						<div className="col-md-12">
							<input
								value={label}
								onChange={e => this.handlers.label(e.target.value)}
								type="text"
								placeholder={D.searchLabelPlaceholder}
								className="form-control"
							/>
						</div>
					</div>
					<div className="row form-group">
						<div className="col-md-12">
							<input
								value={altLabel}
								onChange={e => this.handlers.altLabel(e.target.value)}
								type="text"
								placeholder={D.searchAltLabelPlaceholder}
								className="form-control"
							/>
						</div>
					</div>
					<div className="row form-group">
						<div className="col-md-12">
							<input
								value={definition}
								onChange={e => this.handlers.definition(e.target.value)}
								type="text"
								placeholder={D.searchDefinitionPlaceholder}
								className="form-control"
							/>
						</div>
					</div>
					<div className="row form-group">
						<div className="col-md-4">
							<SelectRmes
								className="form-control"
								placeholder={D.stampsPlaceholder}
								value={creator}
								options={stampList.map(stamp => ({
									label: stamp,
									value: stamp,
								}))}
								onChange={this.handlers.creator}
								searchable={true}
							/>
						</div>
						<div className="col-md-4">
							<SelectRmes
								className="form-control"
								placeholder={D.disseminationStatusPlaceholder}
								value={disseminationStatus}
								options={disseminationStatusList.map(
									({ label, url: value }) => ({ label, value })
								)}
								onChange={this.handlers.disseminationStatus}
								searchable={true}
							/>
						</div>
						<div className="col-md-4">
							<SelectRmes
								className="form-control"
								placeholder={D.validationStatusPlaceholder}
								value={validationStatus}
								options={[
									{ label: 'Validé', value: 'Validé' },
									{ label: 'Provisoire', value: 'Provisoire' },
								]}
								onChange={this.handlers.validationStatus}
								searchable={true}
							/>
						</div>
					</div>
					<div className="row vertical-center">
						<div className="col-md-3 centered">
							<label>{D.conceptsCreationDateMessage}</label>
						</div>
						<div className="col-md-4">
							<DatePickerRmes
								value={dateCreatedStart}
								onChange={this.handlers.dateCreatedStart}
								placement="bottom"
							/>
						</div>
						<div className="col-md-1 centered">
							<label>{D.conceptsTransitionDateMessage}</label>
						</div>
						<div className="col-md-4">
							<DatePickerRmes
								value={dateCreatedEnd}
								onChange={this.handlers.dateCreatedEnd}
								placement="bottom"
							/>
						</div>
					</div>
					<div className="row vertical-center">
						<div className="col-md-3 centered">
							<label>{D.conceptsUpdateDateMessage}</label>
						</div>
						<div className="col-md-4">
							<DatePickerRmes
								value={dateModifiedStart}
								onChange={this.handlers.dateModifiedStart}
								placement="bottom"
							/>
						</div>
						<div className="col-md-1 centered">
							<label>{D.conceptsTransitionDateMessage}</label>
						</div>
						<div className="col-md-4">
							<DatePickerRmes
								value={dateModifiedEnd}
								onChange={this.handlers.dateModifiedEnd}
								placement="bottom"
							/>
						</div>
					</div>
					<div className="centered">
						<div>
							<h4>{nbResults(hitEls)}</h4>
						</div>
						<div>
							<Pagination
								itemEls={hitEls}
								itemsPerPage="10"
								context="concepts"
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const propTypesGeneralForSearch = PropTypes.shape({
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	altLabel: PropTypes.string,
	definition: PropTypes.string,
	created: PropTypes.string,
	modified: PropTypes.string,
	creator: PropTypes.string,
	disseminationStatus: PropTypes.string,
	validationStatus: PropTypes.string,
});

ConceptSearchList.propTypes = {
	conceptSearchList: PropTypes.arrayOf(propTypesGeneralForSearch).isRequired,
	//TODO create generic prop types for stamps and dissemintation statuses
	stampList: PropTypes.array.isRequired,
	disseminationStatusList: PropTypes.array.isRequired,
};

export default ConceptSearchList;
