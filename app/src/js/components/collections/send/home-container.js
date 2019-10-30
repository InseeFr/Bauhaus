import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Loading } from 'bauhaus-library';
import { SEND_COLLECTION } from 'js/actions/constants';
import loadGeneral from 'js/actions/collections/general';
import sendCollection from 'js/actions/collections/send';
import * as select from 'js/reducers';
import buildExtract from 'js/utils/build-extract';
import { OK } from 'js/constants';
import SendStatus from './status';
import CollectionSend from './home';

const extractId = buildExtract('id');

class CollectionSendContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sendRequested: false,
		};
		this.handleCollectionSend = (id, data) => {
			this.props.sendCollection(id, data);
			this.setState({
				sendRequested: true,
			});
		};
	}
	componentWillMount() {
		const { id, loaded, loadGeneral } = this.props;
		if (!loaded) loadGeneral(id);
	}

	render() {
		const {
			id,
			prefLabelLg1,
			isValidated,
			properties,
			loaded,
			sendStatus,
		} = this.props;
		const { sendRequested } = this.state;
		if (sendRequested) {
			const urlBack = sendStatus === OK ? '/collections' : `/collection/${id}`;
			return (
				<SendStatus
					label={prefLabelLg1}
					status={sendStatus}
					urlBack={urlBack}
				/>
			);
		}
		if (!loaded || !properties) return <Loading textType="loading" />;
		return (
			<CollectionSend
				id={id}
				prefLabelLg1={prefLabelLg1}
				isValidated={isValidated}
				properties={properties}
				sendCollection={this.handleCollectionSend}
			/>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	let prefLabelLg1, isValidated;
	const id = extractId(ownProps);
	const general = select.getCollectionGeneral(state, id);
	if (general) {
		({ prefLabelLg1, isValidated } = general);
	}
	return {
		id,
		sendStatus: select.getStatus(state, SEND_COLLECTION),
		loaded: Boolean(general),
		prefLabelLg1,
		isValidated,
		properties: state.app.properties,
	};
};

const mapDispatchToProps = {
	loadGeneral,
	sendCollection,
};

CollectionSendContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CollectionSendContainer);

CollectionSendContainer.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			id: PropTypes.string.isRequired,
		}),
	}),
};

export default CollectionSendContainer;
