import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import ClassificationTree from './home';
import Loading from 'js/components/shared/loading';
import loadClassificationItems from 'js/actions/classifications/items';
import loadClassificationGeneral from 'js/actions/classifications/general';
import { saveSecondLang } from 'js/actions/app';
import * as selectT from 'js/reducers/classifications/items';
import * as selectG from 'js/reducers/classifications/classification/general';
import buildExtract from 'js/utils/build-extract';
import { getTreeFromFlatData } from 'react-sortable-tree';
import { getSecondLang } from 'js/reducers/app';

const extractId = buildExtract('id');

class ClassificationTreeContainer extends Component {
	constructor(props) {
		super();
	}
	componentWillMount() {
		const { flatTree, general, id } = this.props;
		if (!flatTree) this.props.loadClassificationItems(id);
		if (!general) this.props.loadClassificationGeneral(id);
	}
	componentWillReceiveProps({ id }) {
		if (id !== this.props.id) {
			this.props.loadClassificationItems(id);
			this.props.loadClassificationGeneral(id);
		}
	}
	render() {
		const { flatTree, general, secondLang } = this.props;
		if (!(flatTree && general))
			return <Loading textType="loading" context="classifications" />;
		const { prefLabelLg1, prefLabelLg2 } = general;
		const label = secondLang ? 'labelLg2' : 'labelLg1';
		const data =
			(flatTree.length !== 0 &&
				flatTree[0][label] &&
				getTreeFromFlatData({
					flatData: flatTree.map(n => ({
						id: n.id,
						//title: '',
						label: n[label] ? `${n.id} - ${n[label]}` : n.id,
						parent: n.parent || null,
					})),
					getKey: node => node.id,
					getParentKey: node => node.parent,
					rootKey: null,
				})) ||
			[];
		return (
			<ClassificationTree
				prefLabel={secondLang ? prefLabelLg2 : prefLabelLg1}
				data={data}
				secondLang={secondLang}
				saveSecondLang={this.props.saveSecondLang}
			/>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	const flatTree = selectT.getItems(state, id);
	const general = selectG.getGeneral(state.classificationGeneral, id);
	const secondLang = getSecondLang(state);
	return {
		id,
		flatTree,
		general,
		secondLang,
	};
};

const mapDispatchToProps = {
	loadClassificationItems,
	loadClassificationGeneral,
	saveSecondLang,
};

ClassificationTreeContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ClassificationTreeContainer);

ClassificationTreeContainer.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			id: PropTypes.string.isRequired,
		}),
	}),
};
export default ClassificationTreeContainer;
