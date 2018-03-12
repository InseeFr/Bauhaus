import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { VALIDATE_CONCEPT_LIST } from 'js/actions/constants';
import validateConcepts from 'js/actions/concepts/validate';
import * as select from 'js/reducers';
import buildExtract from 'js/utils/build-extract';
import { saveSecondLang } from 'js/actions/app';
import loadConcept from 'js/actions/concepts/concept';
import loadDisseminationStatusList from 'js/actions/dissemination-status';
import loadStampList from 'js/actions/stamp';
import loadGeneralAndAllNotes from 'js/actions/concepts/general-and-all-notes';
import check from 'js/utils/auth/utils';
import { dictionary } from 'js/utils/dictionary';
import Loadable from 'react-loading-overlay';
import ConceptVisualization from './visualization';
import ConceptVisualizationStandBy from './visualization-stand-by';
import { OK } from 'js/constants';
const extractId = buildExtract('id');

class ConceptVisualizationContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			validationRequested: false,
		};
		this.handleConceptValidation = id => {
			this.props.validateConcept(id);
			this.setState({
				validationRequested: true,
			});
		};
	}
	componentWillMount() {
		const {
			id,
			concept,
			allNotes,
			stampList,
			disseminationStatusList,
		} = this.props;
		if (!concept) this.props.loadConcept(id);
		if (!stampList) this.props.loadStampList();
		if (!disseminationStatusList) this.props.loadDisseminationStatusList();
		if (!allNotes) {
			this.props.loadGeneralAndAllNotes(id);
		}
	}

	componentWillReceiveProps({ id, validationStatus }) {
		if (id !== this.props.id) {
			this.props.loadConcept(id);
		}
		if (this.state.validationRequested && validationStatus === OK) {
			//validation has been processed successfully, we can show the
			//component again
			this.setState({
				validationRequested: false,
			});
			//we need to load the concept again
			this.props.loadConcept(id);
		}
	}
	render() {
		const { validationRequested } = this.state;
		const { validationStatus } = this.props;
		if (validationRequested && validationStatus !== OK) {
			//if validation is OK: nothing to do. We stay on this page and the concept will
			//be loaded automatically (since the entries for the given concept in the store will
			//be deleted).
			if (validationStatus !== OK) {
				return (
					<div>
						<Loadable
							active={true}
							spinner
							text={dictionary.loadable.validation}
							color="#457DBB"
							background="grey"
							spinnerSize="400px"
						/>
					</div>
				);
			}
		}
		const {
			id,
			permission,
			concept,
			allNotes,
			stampList,
			disseminationStatusList,
			secondLang,
		} = this.props;
		if (concept && stampList && disseminationStatusList && allNotes) {
			const { general, links } = concept;
			let { notes } = concept;
			const { conceptVersion, isValidated, creator } = general;
			const { authType, role, stamp } = permission;
			const authImpl = check(authType);
			const adminOrContributorOrConceptCreator = authImpl.isAdminOrContributorOrConceptCreator(
				role,
				stamp,
				creator
			);
			if (
				!adminOrContributorOrConceptCreator &&
				isValidated === 'Provisoire' &&
				conceptVersion === '1'
			)
				return <ConceptVisualizationStandBy general={general} />;
			if (
				conceptVersion !== '1' &&
				isValidated === 'Provisoire' &&
				!adminOrContributorOrConceptCreator
			) {
				general.isValidated = 'Validé';
				general.conceptVersion = (general.conceptVersion - 1).toString();
				notes = allNotes[general.conceptVersion];
			}

			return (
				<ConceptVisualization
					id={id}
					permission={permission}
					general={general}
					notes={notes}
					links={links}
					stampList={stampList}
					disseminationStatusList={disseminationStatusList}
					validateConcept={this.handleConceptValidation}
					validationStatus={validationStatus}
					secondLang={secondLang}
					saveSecondLang={this.props.saveSecondLang}
				/>
			);
		}
		return (
			<div>
				<Loadable
					active={true}
					spinner
					text={dictionary.loadable.loading}
					color="#457DBB"
					background="grey"
					spinnerSize="400px"
				/>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	let allNotes;
	const general = select.getConceptGeneral(state, id);
	if (general) {
		allNotes = select.getAllNotes(state, id, general.conceptVersion);
	}
	return {
		id,
		permission: select.getPermission(state),
		secondLang: state.app.secondLang,
		concept: select.getConcept(state, id),
		allNotes,
		stampList: select.getStampList(state),
		disseminationStatusList: select.getDisseminationStatusList(state),
		//TODO should check if the concept which has been validated are the same
		//a validation has been requested for.
		validationStatus: select.getStatus(state, VALIDATE_CONCEPT_LIST),
	};
};

const mapDispatchToProps = {
	saveSecondLang,
	loadConcept,
	loadDisseminationStatusList,
	loadStampList,
	loadGeneralAndAllNotes,
	validateConcept: id => validateConcepts([id]),
};

ConceptVisualizationContainer = connect(mapStateToProps, mapDispatchToProps)(
	ConceptVisualizationContainer
);

ConceptVisualizationContainer.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			id: PropTypes.string.isRequired,
		}),
	}),
};
export default ConceptVisualizationContainer;
