import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { VALIDATE_COLLECTION_LIST } from 'js/actions/constants';
import validateCollection from 'js/actions/collections/validate';
import * as select from 'js/reducers';
import buildExtract from 'js/utils/build-extract';
import { saveSecondLang } from 'js/actions/app';
import loadCollections from 'js/actions/collections/collection';
import loadStampList from 'js/actions/stamp';
import { dictionary } from 'js/utils/dictionary';
import Loadable from 'react-loading-overlay';
import CollectionVisualization from './visualization';
import { OK } from 'js/constants';
const extractId = buildExtract('id');

class CollectionVisualizationContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			validationRequested: false,
		};
		this.handleCollectionValidation = id => {
			this.props.validateCollection(id);
			this.setState({
				validationRequested: true,
			});
		};
	}
	componentWillMount() {
		const { id, collection, stampList } = this.props;
		if (!collection) this.props.loadCollections(id);
		if (!stampList) this.props.loadStampList();
	}

	componentWillReceiveProps({ id, validationStatus }) {
		if (id !== this.props.id) {
			this.props.loadCollections(id);
		}
		if (this.state.validationRequested && validationStatus === OK) {
			//validation has been processed successfully, we can show the
			//component again
			this.setState({
				validationRequested: false,
			});
			//we need to load the collection again
			this.props.loadCollections(id);
		}
	}
	render() {
		const { validationRequested } = this.state;
		const { validationStatus } = this.props;
		if (validationRequested && validationStatus !== OK) {
			//if validation is OK: nothing to do. We stay on this page and the collection will
			//be loaded automatically (since the entries for the given collection in the store will
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
		const { id, permission, collection, stampList, secondLang } = this.props;
		if (collection && stampList) {
			const { general, members } = collection;
			return (
				<CollectionVisualization
					id={id}
					permission={permission}
					general={general}
					members={members}
					stampList={stampList}
					validateCollection={this.handleCollectionValidation}
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
		permission: select.getPermission(state),
		secondLang: state.app.secondLang,
		collection: select.getCollection(state, id),
		stampList: select.getStampList(state),
		//TODO should check if the collection which has been validated are the same
		//a validation has been requested for.
		validationStatus: select.getStatus(state, VALIDATE_COLLECTION_LIST),
	};
};

const mapDispatchToProps = {
	saveSecondLang,
	loadCollections,
	loadStampList,
	validateCollection: id => validateCollection([id]),
};

CollectionVisualizationContainer = connect(mapStateToProps, mapDispatchToProps)(
	CollectionVisualizationContainer
);

CollectionVisualizationContainer.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			id: PropTypes.string.isRequired,
		}),
	}),
};
export default CollectionVisualizationContainer;
