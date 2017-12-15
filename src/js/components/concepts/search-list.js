import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import SelectRmes from 'js/components/shared/select-rmes';
import DatePickerRmes from 'js/components/shared/date-picker-rmes';
import { dictionary } from 'js/utils/dictionary';
import Pagination from 'js/components/shared/pagination';
import { filterKeyDeburr, filterKeyDate } from 'js/utils/array-utils';
import 'css/app.css';

const filterLabel = filterKeyDeburr('label');
const filterDefinition = filterKeyDeburr('definition');
const filterCreator = filterKeyDeburr('creator');
const filterDisseminationStatus = filterKeyDeburr('disseminationStatus');
const filterValidationStatus = filterKeyDeburr('validationStatus');
const filterCreatedDate = filterKeyDate('created');
const filterModifiedDate = filterKeyDate('modified');

const fields = [
	'label',
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

		//stateChange: { label: 'new label' }
		this.handleChange = stateChange => {
			const newState = Object.assign(this.state, stateChange);
			const {
				label,
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
					<div className="row">
						<div className="col-md-10 centered col-md-offset-1">
							<h2 className="page-title">{dictionary.concepts.search.title}</h2>
						</div>
					</div>
					<div className="row btn-line">
						<div className="col-md-2">
							<button
								type="button"
								className="btn btn-primary btn-lg col-md-12"
								onClick={this.onClickReturn}
							>
								<span
									className="glyphicon glyphicon-menu-left"
									aria-hidden="true"
								/>{' '}
								{dictionary.buttons.return}
							</button>
						</div>
						<div className="col-md-2 pull-right">
							<button
								type="button"
								className="btn btn-primary btn-lg col-md-12"
								onClick={this.initializeState}
							>
								<span
									className="glyphicon glyphicon-flash"
									aria-hidden="true"
								/>{' '}
								{dictionary.buttons.initialize}
							</button>
						</div>
					</div>
					<div className="row form-group">
						<div className="col-md-12">
							<input
								value={label}
								onChange={e => this.handlers.label(e.target.value)}
								type="text"
								placeholder={dictionary.concepts.search.label}
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
								placeholder={dictionary.concepts.search.definition}
								className="form-control"
							/>
						</div>
					</div>
					<div className="row form-group">
						<div className="col-md-4">
							<SelectRmes
								className="form-control"
								placeholder={dictionary.concept.stamps.defaultValue}
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
								placeholder={
									dictionary.concept.disseminationStatus.defaultValue
								}
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
								placeholder={
									dictionary.status.concept.validationStatus.defaultValue
								}
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
							<label>Concept créé entre le </label>
						</div>
						<div className="col-md-4">
							<DatePickerRmes
								value={dateCreatedStart}
								onChange={this.handlers.dateCreatedStart}
								placement="bottom"
							/>
						</div>
						<div className="col-md-1 centered">
							<label> et le </label>
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
							<label>Concept modifié entre le </label>
						</div>
						<div className="col-md-4">
							<DatePickerRmes
								value={dateModifiedStart}
								onChange={this.handlers.dateModifiedStart}
								placement="bottom"
							/>
						</div>
						<div className="col-md-1 centered">
							<label> et le </label>
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
							<h4>{singOrPluralResult(hitEls)}</h4>
						</div>
						<div>
							<Pagination itemEls={hitEls} itemsPerPage="10" />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

//TODO check if it works as
function singOrPluralResult(list) {
	const word =
		list.length > 1 ? dictionary.concepts.results : dictionary.concepts.result;
	return `${list.length} ${word}`;
}

const propTypesGeneralForSearch = PropTypes.shape({
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
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
