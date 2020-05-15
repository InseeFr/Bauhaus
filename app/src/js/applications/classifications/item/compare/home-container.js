import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Loading, buildExtract } from '@inseefr/wilco';
import Compare from './home';
import loadItem from 'js/actions/classifications/item';
import * as select from 'js/reducers/classifications/item';
import * as mainSelect from 'js/reducers';
import { Stores } from 'bauhaus-utilities';

const extractClassificationId = buildExtract('classificationId');
const extractItemId = buildExtract('itemId');

class CompareContainer extends Component {
	static propTypes = {
		classificationId: PropTypes.string.isRequired,
		itemId: PropTypes.string.isRequired,
	};

	componentWillMount() {
		const { classificationId, itemId, item } = this.props;
		if (!item) {
			this.props.loadItem(classificationId, itemId);
		}
	}

	render() {
		let { classificationId, itemId, item, secondLang, langs } = this.props;
		if (!item) return <Loading />;
		const { general, notes } = item;
		return (
			<Compare
				classificationId={classificationId}
				itemId={itemId}
				general={general}
				notes={notes}
				secondLang={secondLang}
				langs={langs}
			/>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const classificationId = extractClassificationId(ownProps);
	const itemId = extractItemId(ownProps);
	const item = select.getFullItem(state, classificationId, itemId);
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

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(CompareContainer));
