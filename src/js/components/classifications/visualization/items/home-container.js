import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import ClassificationItems from './home';
import Loading from 'js/components/shared/loading';
import loadClassificationItems from 'js/actions/classifications/items';
import loadClassificationGeneral from 'js/actions/classifications/general';
import { saveSecondLang } from 'js/actions/app';
import * as selectT from 'js/reducers/classifications/items';
import * as selectG from 'js/reducers/classifications/classification/general';
import buildExtract from 'js/utils/build-extract';

const extractId = buildExtract('id');

class ClassificationItemsContainer extends Component {
	constructor(props) {
		super();
	}
	componentWillMount() {
		const { items, general, id } = this.props;
		if (!items) this.props.loadClassificationItems(id);
		if (!general) this.props.loadClassificationGeneral(id);
	}
	componentWillReceiveProps({ id }) {
		if (id !== this.props.id) {
			this.props.loadClassificationItems(id);
			this.props.loadClassificationGeneral(id);
		}
	}
	render() {
		const { items, general, id, secondLang } = this.props;

		if (!(items && general))
			return <Loading textType="loading" context="classifications" />;

		const { prefLabelLg1, prefLabelLg2 } = general;
		const label = secondLang ? 'labelLg2' : 'labelLg1';
		const data =
			(items.length !== 0 &&
				items[0][label] &&
				items.map(n => ({
					id: n.id,
					label: `${n.id} - ${n[label]}`,
				}))) ||
			[];

		return (
			<ClassificationItems
				items={data}
				subtitle={secondLang ? prefLabelLg2 : prefLabelLg1}
				classificationId={id}
				secondLang={secondLang}
				saveSecondLang={this.props.saveSecondLang}
			/>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	const items = selectT.getItems(state, id);
	const general = selectG.getGeneral(state.classificationGeneral, id);
	const secondLang = state.app.secondLang;
	return {
		id,
		items,
		general,
		secondLang,
	};
};

const mapDispatchToProps = {
	loadClassificationItems,
	loadClassificationGeneral,
	saveSecondLang,
};

ClassificationItemsContainer = connect(mapStateToProps, mapDispatchToProps)(
	ClassificationItemsContainer
);

ClassificationItemsContainer.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			id: PropTypes.string.isRequired,
		}),
	}),
};
export default ClassificationItemsContainer;
