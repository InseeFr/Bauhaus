import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { CREATE_COLLECTION } from 'js/actions/constants';
import * as select from 'js/reducers';
import loadConceptList from 'js/actions/concepts/list';
import loadCollectionList from 'js/actions/collections/list';
import loadStampList from 'js/actions/stamp';
import createCollection from 'js/actions/collections/create';
import buildPayload from 'js/utils/collections/build-payload/build-payload';
import CollectionEditionCreation from './edition-creation';
import { dictionary } from 'js/utils/dictionary';
import emptyCollection from 'js/utils/collections/empty-collection';
import { bindToCollectionId } from 'js/utils/utils';
import PageTitle from 'js/components/shared/page-title';
import Loadable from 'react-loading-overlay';
import { OK } from 'js/constants';

class CreationContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			creationRequested: false,
			id: '',
		};

		this.handleCreation = data => {
			this.props.createCollection(buildPayload(data, 'CREATE'));
			this.setState({
				creationRequested: true,
				id: data.general.id,
			});
		};
	}

	componentWillMount() {
		const { conceptList, collectionList, stampList } = this.props;
		if (!conceptList) this.props.loadConceptList();
		if (!collectionList) this.props.loadCollectionList();
		if (!stampList) this.props.loadStampList();
	}

	render() {
		const {
			collection,
			collectionList,
			conceptList,
			stampList,
			creationStatus,
		} = this.props;

		if (this.state.creationRequested) {
			if (creationStatus === OK) {
				return (
					<Redirect to={`/collection/${bindToCollectionId(this.state.id)}`} />
				);
			} else
				return (
					<Loadable
						active={true}
						spinner
						text={dictionary.loadable.saving}
						color="#457DBB"
						background="grey"
						spinnerSize="400px"
					/>
				);
		}
		if (conceptList && stampList) {
			const { general, members } = collection;
			const pageTitle = <PageTitle title={dictionary.collection.create} />;
			return (
				<CollectionEditionCreation
					creation
					pageTitle={pageTitle}
					general={general}
					members={members}
					collectionList={collectionList}
					conceptList={conceptList}
					stampList={stampList}
					isActionProcessed={creationStatus}
					save={this.handleCreation}
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
	return {
		collection: emptyCollection(),
		collectionList: select.getCollectionList(state),
		conceptList: select.getConceptList(state),
		stampList: select.getStampList(state),
		//TODO build appropriate selector
		creationStatus: select.getStatus(state, CREATE_COLLECTION),
	};
};

const mapDispatchToProps = {
	loadConceptList,
	loadCollectionList,
	loadStampList,
	createCollection,
};

CreationContainer = connect(mapStateToProps, mapDispatchToProps)(
	CreationContainer
);

export default CreationContainer;
