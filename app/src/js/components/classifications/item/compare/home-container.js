import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Loading } from 'bauhaus-library';
import Compare from './home';
import { saveSecondLang } from 'js/actions/app';
import loadItem from 'js/actions/classifications/item';
import buildExtract from 'bauhaus-library/src/utils/build-extract';
import * as select from 'js/reducers/classifications/item';
import * as mainSelect from 'js/reducers';
import { getSecondLang } from 'js/reducers/app';

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
				saveSecondLang={this.props.saveSecondLang}
				langs={langs}
			/>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const classificationId = extractClassificationId(ownProps);
	const itemId = extractItemId(ownProps);
	const item = select.getFullItem(state, classificationId, itemId);
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

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(CompareContainer));
