import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import D from 'js/i18n';
import buildExtract from 'js/utils/build-extract';
import { goBack } from 'js/utils/redirection';
import { connect } from 'react-redux';
import * as select from 'js/reducers';
import CheckSecondLang from 'js/components/shared/second-lang-checkbox';
import { saveSecondLang } from 'js/actions/app';
import OperationsIndicatorVisualization from 'js/components/operations/indicators/visualization/general';
import Loading from 'js/components/shared/loading';
import loadIndicator from 'js/actions/operations/indicators/item';
import Button from 'js/components/shared/button';
import { CL_FREQ } from 'js/actions/constants/codeList';
import { getSecondLang } from 'js/reducers/app';
import Auth from 'js/utils/auth/components/auth';
import { INDICATOR_CREATOR, ADMIN, SERIES_CREATOR } from 'js/utils/auth/roles';
import PageTitleBlock from 'js/components/shared/page-title-block';
import { containUnsupportedStyles } from 'js/utils/html';

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
		if (!attr.id) return <Loading textType="loading" />;

		/*
		 * The publication button should be enabled only if RICH_TEXT value do not
		 * have unsupported styles like STRIKETHROUGH, color or background color
		 */
		const publicationDisabled = containUnsupportedStyles(attr);

		return (
			<div className="container">
				<CheckSecondLang
					secondLang={secondLang}
					onChange={this.props.saveSecondLang}
				/>

				<PageTitleBlock
					titleLg1={attr.prefLabelLg1}
					titleLg2={attr.prefLabelLg2}
					secondLang={secondLang}
				/>

				<div className="row btn-line action-toolbar">
					<Button
						action={goBack(this.props, '/operations/indicators')}
						label={D.btnReturn}
					/>
					<div className="empty-center" />
					{attr.idSims && (
						<>
							<Button
								action={`/operations/sims/${attr.idSims}`}
								label={D.btnSimsVisu}
							/>
						</>
					)}
					{!attr.idSims && (
						<Auth roles={[ADMIN, SERIES_CREATOR, INDICATOR_CREATOR]}>
							<Button
								action={`/operations/indicator/${attr.id}/sims/create`}
								label={D.btnSimsCreate}
							/>
						</Auth>
					)}
					<Auth roles={[ADMIN, INDICATOR_CREATOR]}>
						<Button disabled={publicationDisabled} label={D.btnValid} />
					</Auth>
					<Auth roles={[ADMIN, INDICATOR_CREATOR]}>
						<Button
							action={`/operations/indicator/${attr.id}/modify`}
							label={D.btnUpdate}
						/>
					</Auth>
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

export const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	const indicator = select.getIndicator(state);
	const frequencies = state.operationsCodesList.results[CL_FREQ] || {};
	const organisations = state.operationsOrganisations.results || [];
	return {
		id,
		indicator: indicator.id === id ? indicator : {},
		langs: select.getLangs(state),
		secondLang: getSecondLang(state),
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
