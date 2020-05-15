import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import ItemVisualization from './home';
import { buildExtract, Loading } from '@inseefr/wilco';
import loadItem from 'js/actions/classifications/item';
import * as select from 'js/reducers/classifications/item';
import * as mainSelect from 'js/reducers';
import { Stores } from 'bauhaus-utilities';

const extractClassificationId = buildExtract('classificationId');
const extractItemId = buildExtract('itemId');

class ItemVisualizationContainer extends Component {
	static propTypes = {
		match: PropTypes.shape({
			params: PropTypes.shape({
				classificationId: PropTypes.string.isRequired,
				itemId: PropTypes.string.isRequired,
			}),
		}),
	};
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
		if (!item) return <Loading />;
		return (
			<ItemVisualization item={item} secondLang={secondLang} langs={langs} />
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const classificationId = extractClassificationId(ownProps);
	const itemId = extractItemId(ownProps);
	const item = select.getItem(state, classificationId, itemId);
	const secondLang = Stores.SecondLang.getSecondLang(state);
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
	loadItem,
};

ItemVisualizationContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ItemVisualizationContainer);

export default ItemVisualizationContainer;
