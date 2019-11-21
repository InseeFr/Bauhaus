import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Loading } from 'bauhaus-library';
import { SEND_CONCEPT } from 'js/actions/constants';
import loadGeneral from 'js/actions/concepts/general';
import sendConcept from 'js/actions/concepts/send';
import * as select from 'js/reducers';
import buildExtract from 'bauhaus-library/src/utils/build-extract';
import { OK } from 'js/constants';
import SendStatus from './status';
import ConceptSend from './home';

const extractId = buildExtract('id');

class ConceptSendContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sendRequested: false,
		};
		this.handleConceptSend = (id, data) => {
			this.props.sendConcept(id, data);
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
			const urlBack = sendStatus === OK ? '/concepts' : `/concept/${id}`;
			return (
				<SendStatus
					label={prefLabelLg1}
					status={sendStatus}
					urlBack={urlBack}
				/>
			);
		}
		if (!loaded || !properties) return <Loading />;
		return (
			<ConceptSend
				id={id}
				prefLabelLg1={prefLabelLg1}
				isValidated={isValidated}
				properties={properties}
				sendConcept={this.handleConceptSend}
			/>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	let prefLabelLg1, isValidated;
	const id = extractId(ownProps);
	const general = select.getConceptGeneral(state, id);
	if (general) {
		({ prefLabelLg1, isValidated } = general);
	}
	return {
		id,
		sendStatus: select.getStatus(state, SEND_CONCEPT),
		loaded: Boolean(general),
		prefLabelLg1,
		isValidated,
		properties: state.app.properties,
	};
};

const mapDispatchToProps = {
	loadGeneral,
	sendConcept,
};

ConceptSendContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ConceptSendContainer);

ConceptSendContainer.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			id: PropTypes.string.isRequired,
		}),
	}),
};

export default ConceptSendContainer;
