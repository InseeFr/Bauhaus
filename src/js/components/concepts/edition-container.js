import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as select from 'js/reducers';
import { UPDATE_CONCEPT } from 'js/actions/constants';
import loadConcept from 'js/actions/concepts/concept';
import loadConceptList from 'js/actions/concepts/list';
import loadDisseminationStatusList from 'js/actions/dissemination-status';
import loadStampList from 'js/actions/stamp';
import updateConcept from 'js/actions/concepts/update';
import ConceptEditionCreation from './edition-creation';
import buildPayloadUpdate from 'js/utils/concepts/build-payload-creation-update/build-payload-update';
import buildExtract from 'js/utils/build-extract';
import { mergeWithAllConcepts } from 'js/utils/concepts/links';
import { dictionary } from 'js/utils/dictionary';
import Loadable from 'react-loading-overlay';
import { OK } from 'js/constants';
import PageTitle from 'js/components/shared/page-title';

const extractId = buildExtract('id');

class EditionContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			updateRequested: false,
		};

		this.handleUpdate = (id, versioning, oldData, data) => {
			this.props.updateConcept(
				id,
				buildPayloadUpdate(versioning, oldData, data)
			);
			this.setState({
				updateRequested: true,
			});
		};
	}

	componentWillMount() {
		const {
			id,
			concept,
			conceptList,
			stampList,
			disseminationStatusList,
		} = this.props;
		if (!concept) this.props.loadConcept(id);
		if (!conceptList) this.props.loadConceptList();
		if (!stampList) this.props.loadStampList();
		if (!disseminationStatusList) this.props.loadDisseminationStatusList();
	}

	render() {
		if (this.state.updateRequested) {
			if (this.props.updateStatus === OK) {
				return <Redirect to={`/concept/${this.props.id}`} />;
			} else {
				return (
					<Loadable
						active={true}
						spinner
						//TODO check if right message used here
						text={dictionary.loadable.saving}
						color="#457DBB"
						background="grey"
						spinnerSize="400px"
					/>
				);
			}
		}
		const {
			id,
			concept,
			conceptList,
			stampList,
			disseminationStatusList,
			maxLengthScopeNote,
			updateStatus,
		} = this.props;
		if (concept && conceptList && stampList && disseminationStatusList) {
			const { general, notes, links } = concept;
			const conceptsWithLinks = mergeWithAllConcepts(conceptList, links);
			const pageTitle = (
				<PageTitle
					title={dictionary.concept.modify}
					subtitle={general.prefLabelLg1}
				/>
			);
			return (
				<ConceptEditionCreation
					id={id}
					pageTitle={pageTitle}
					general={general}
					notes={notes}
					conceptsWithLinks={conceptsWithLinks}
					disseminationStatusList={disseminationStatusList}
					maxLengthScopeNote={maxLengthScopeNote}
					stampList={stampList}
					isActionProcessed={updateStatus}
					save={this.handleUpdate}
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
		concept: select.getConcept(state, id),
		conceptList: select.getConceptList(state),
		stampList: select.getStampList(state),
		disseminationStatusList: select.getDisseminationStatusList(state),
		maxLengthScopeNote: Number(state.app.properties.maxLengthScopeNote),
		updateStatus: select.getStatus(state, UPDATE_CONCEPT),
	};
};

const mapDispatchToProps = {
	loadConcept,
	loadConceptList,
	loadDisseminationStatusList,
	loadStampList,
	updateConcept,
};

EditionContainer = connect(mapStateToProps, mapDispatchToProps)(
	EditionContainer
);

EditionContainer.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			id: PropTypes.string.isRequired,
		}),
	}),
};

export default EditionContainer;
