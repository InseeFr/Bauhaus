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
import { dictionary } from 'js/utils/dictionary';
import Loadable from 'react-loading-overlay';
import ConceptVisualization from './visualization';
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
		const { id, concept, stampList, disseminationStatusList } = this.props;
		if (!concept) this.props.loadConcept(id);
		if (!stampList) this.props.loadStampList();
		if (!disseminationStatusList) this.props.loadDisseminationStatusList();
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
			concept,
			stampList,
			disseminationStatusList,
			secondLang,
		} = this.props;
		if (concept && stampList && disseminationStatusList) {
			const { general, notes, links } = concept;
			return (
				<ConceptVisualization
					id={id}
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
	return {
		id,
		secondLang: state.app.secondLang,
		concept: select.getConcept(state, id),
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
