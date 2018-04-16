import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import ClassificationTree from './home';
import Loading from 'js/components/shared/loading';
import loadClassificationTree from 'js/actions/classifications/tree';
import loadClassificationGeneral from 'js/actions/classifications/general';
import * as selectT from 'js/reducers/classifications/tree';
import * as selectG from 'js/reducers/classifications/classification/general';
import buildExtract from 'js/utils/build-extract';

const extractId = buildExtract('id');

class ClassificationTreeContainer extends Component {
	constructor(props) {
		super();
	}
	componentWillMount() {
		const { flatTree, general, id } = this.props;
		if (!flatTree) this.props.loadClassificationTree(id);
		if (!general) this.props.loadClassificationGeneral(id);
	}
	componentWillReceiveProps({ id }) {
		if (id !== this.props.id) {
			this.props.loadClassificationTree(id);
			this.props.loadClassificationGeneral(id);
		}
	}
	render() {
		const { flatTree, general } = this.props;
		console.log(flatTree);
		console.log(general);
		if (!(flatTree && general))
			return <Loading textType="loading" context="classifications" />;
		const { prefLabelLg1 } = general;
		return (
			<ClassificationTree prefLabelLg1={prefLabelLg1} flatTree={flatTree} />
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	const flatTree = selectT.getTree(state, id);
	const general = selectG.getGeneral(state.classificationGeneral, id);
	return {
		id,
		flatTree,
		general,
	};
};

const mapDispatchToProps = {
	loadClassificationTree,
	loadClassificationGeneral,
};

ClassificationTreeContainer = connect(mapStateToProps, mapDispatchToProps)(
	ClassificationTreeContainer
);

ClassificationTreeContainer.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			id: PropTypes.string.isRequired,
		}),
	}),
};
export default ClassificationTreeContainer;
