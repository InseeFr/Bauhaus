import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PageTitle from 'js/components/shared/page-title';
import D from 'js/i18n';
import buildExtract from 'js/utils/build-extract';
import { goBack } from 'js/utils/redirection';
import { connect } from 'react-redux';
import * as select from 'js/reducers';
import CheckSecondLang from 'js/components/shared/second-lang-checkbox';
import { saveSecondLang } from 'js/actions/app';
import PageSubtitle from 'js/components/shared/page-subtitle';
import OperationsIndicatorVisualization from 'js/components/operations/indicators/visualization/general';
import Loading from 'js/components/shared/loading';
import loadIndicator from 'js/actions/operations/indicators/item';
import Button from 'js/components/shared/button';
import { CL_FREQ } from 'js/actions/constants/codeList';

const extractId = buildExtract('id');
class IndicatorVisualizationContainer extends Component {
	componentWillMount() {
		if (!this.props.indicator.id) {
			this.props.loadIndicator(this.props.id);
		}
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.id !== nextProps.id) {
			this.props.loadIndicator(nextProps.id);
		}
	}
	render() {
		const {
			secondLang,
			langs,
			indicator: { ...attr },
			frequency,
			organisations,
		} = this.props;
		if (!attr.id) return <Loading textType="loading" context="operations" />;
		return (
			<div className="container">
				<CheckSecondLang
					secondLang={secondLang}
					onChange={this.props.saveSecondLang}
				/>

				<PageTitle title={attr.prefLabelLg1} context="operations" />
				{secondLang &&
					attr.prefLabelLg2 && (
						<PageSubtitle subTitle={attr.prefLabelLg2} context="operations" />
					)}

				<div className="row btn-line">
					<Button
						action={goBack(this.props, '/operations/indicators')}
						label={D.btnReturn}
						context="operations"
					/>

					<div className="col-md-6 centered" />
					<Button label={D.btnSend} context="operations" />
					<Button
						action={`/operations/indicator/${attr.id}/modify`}
						label={D.btnUpdate}
						context="operations"
					/>
				</div>
				<OperationsIndicatorVisualization
					secondLang={secondLang}
					attr={attr}
					langs={langs}
					frequency={frequency}
					organisations={organisations}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	const indicator = select.getIndicator(state, id);
	const frequencies = state.operationsCodesList.results[CL_FREQ] || {};
	const organisations = state.operationsOrganisations.results || [];
	return {
		id,
		indicator: indicator.id === id ? indicator : {},
		langs: select.getLangs(state),
		secondLang: state.app.secondLang,
		frequency: frequencies.codes.find(
			c => c.code === indicator.accrualPeriodicityCode
		),
		organisations,
	};
};
const mapDispatchToProps = {
	saveSecondLang,
	loadIndicator,
};
export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(IndicatorVisualizationContainer)
);
