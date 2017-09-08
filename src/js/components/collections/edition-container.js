import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as select from 'js/reducers';
import { UPDATE_COLLECTION } from 'js/actions/constants';
import loadCollection from 'js/actions/collections/collection';
import loadCollectionList from 'js/actions/collections/list';
import loadConceptList from 'js/actions/concepts/list';
import loadStampList from 'js/actions/stamp';
import updateCollection from 'js/actions/collections/update';
import CollectionEditionCreation from './edition-creation';
import buildPayload from 'js/utils/collections/build-payload/build-payload';
import buildExtract from 'js/utils/build-extract';
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
			id: '',
		};

		this.handleUpdate = data => {
			this.props.updateCollection(
				data.general.id,
				buildPayload(data, 'UPDATE')
			);
			this.setState({
				updateRequested: true,
				id: data.general.id,
			});
		};
	}

	componentWillMount() {
		const {
			id,
			collection,
			collectionList,
			conceptList,
			stampList,
		} = this.props;
		if (!collection) this.props.loadCollection(id);
		if (!collectionList) this.props.loadCollectionList();
		if (!conceptList) this.props.loadConceptList();
		if (!stampList) this.props.loadStampList();
	}

	render() {
		const {
			collection,
			collectionList,
			conceptList,
			stampList,
			updateStatus,
		} = this.props;

		if (this.state.updateRequested) {
			if (this.props.updateStatus === OK) {
				return <Redirect to={`/collection/${this.state.id}`} />;
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
		if (collection && collectionList && conceptList && stampList) {
			const { general, members } = collection;

			const pageTitle = (
				<PageTitle
					title={dictionary.collection.modify}
					subtitle={general.prefLabelLg1}
				/>
			);

			return (
				<CollectionEditionCreation
					pageTitle={pageTitle}
					general={general}
					members={members}
					collectionList={collectionList}
					conceptList={conceptList}
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
		collection: select.getCollection(state, id),
		collectionList: select.getCollectionList(state),
		conceptList: select.getConceptList(state),
		stampList: select.getStampList(state),
		updateStatus: select.getStatus(state, UPDATE_COLLECTION),
	};
};

const mapDispatchToProps = {
	loadCollection,
	loadCollectionList,
	loadConceptList,
	loadStampList,
	updateCollection,
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
