import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import ItemVisualization from './home';
import Loading from 'js/components/shared/loading';
import loadItem from 'js/actions/classifications/item';
import { saveSecondLang } from 'js/actions/app';
import * as select from 'js/reducers/classifications/item';
import * as mainSelect from 'js/reducers';
import buildExtract from 'js/utils/build-extract';
import { getSecondLang } from 'js/reducers/app';

const extractClassificationId = buildExtract('classificationId');
const extractItemId = buildExtract('itemId');

class ItemVisualizationContainer extends Component {
	constructor(props) {
		super();
	}
	componentWillMount() {
		const { classificationId, itemId, item } = this.props;
		if (!item) this.props.loadItem(classificationId, itemId);
	}
	componentWillReceiveProps({ classificationId, itemId }) {
		if (
			itemId !== this.props.itemId &&
			classificationId !== this.props.classificationId
		) {
			this.props.loadItem(classificationId, itemId);
		}
		if (itemId !== this.props.itemId) {
			this.props.loadItem(this.props.classificationId, itemId);
		}
	}
	render() {
		const { item, secondLang, langs } = this.props;
		if (!item) return <Loading textType="loading" context="classifications" />;
		return (
			<ItemVisualization
				item={item}
				secondLang={secondLang}
				saveSecondLang={this.props.saveSecondLang}
				langs={langs}
			/>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const classificationId = extractClassificationId(ownProps);
	const itemId = extractItemId(ownProps);
	const item = select.getItem(state, classificationId, itemId);
	const secondLang = getSecondLang(state);
	const langs = mainSelect.getLangs(state);
	return {
		classificationId,
		itemId,
		item,
		secondLang,
		langs,
	};
};

const mapDispatchToProps = {
	saveSecondLang,
	loadItem,
};

ItemVisualizationContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ItemVisualizationContainer);

ItemVisualizationContainer.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			classificationId: PropTypes.string.isRequired,
			itemId: PropTypes.string.isRequired,
		}),
	}),
};
export default ItemVisualizationContainer;
