import React from 'react';
import { withRouter } from 'react-router-dom';
import D from 'js/i18n';
import { connect } from 'react-redux';
import * as select from 'js/reducers';
import OperationsIndicatorVisualization from 'js/applications/operations/indicators/visualization/general';
import {
	Loading,
	Button,
	ErrorBloc,
	ActionToolbar,
	buildExtract,
	goBack,
	ReturnButton,
} from '@inseefr/wilco';

import loadIndicator, {
	publishIndicator,
} from 'js/actions/operations/indicators/item';
import { CL_FREQ } from 'js/actions/constants/codeList';
import {
	Auth,
	HTMLUtils,
	ValidationButton,
	Stores,
	CheckSecondLang,
	PageTitleBlock,
} from 'bauhaus-utilities';
import VisualizationContainer from 'js/applications/operations/shared/vizualisation-container';

const extractId = buildExtract('id');
class IndicatorVisualizationContainer extends VisualizationContainer {
	render() {
		const {
			secondLang,
			langs,
			object: { ...attr },
			frequency,
			organisations,
		} = this.props;
		const { serverSideError } = this.state;

		if (!attr.id) return <Loading />;

		/*
		 * The publication button should be enabled only if RICH_TEXT value do not
		 * have unsupported styles like STRIKETHROUGH, color or background color
		 */
		const publicationDisabled = HTMLUtils.containUnsupportedStyles(attr);
		const checkStamp = stamp => attr.creators.includes(stamp);

		return (
			<div className="container">
				<PageTitleBlock
					titleLg1={attr.prefLabelLg1}
					titleLg2={attr.prefLabelLg2}
					secondLang={secondLang}
				/>
				<ActionToolbar>
					<ReturnButton action={goBack(this.props, '/operations/indicators')} />
					{attr.idSims && (
						<>
							<Button
								action={`/operations/sims/${attr.idSims}`}
								label={D.btnSimsVisu}
							/>
						</>
					)}
					{!attr.idSims && (
						<Auth.AuthGuard roles={[Auth.ADMIN, [Auth.INDICATOR_CONTRIBUTOR, checkStamp]]}>
							<Button
								action={`/operations/indicator/${attr.id}/sims/create`}
								label={D.btnSimsCreate}
							/>
						</Auth.AuthGuard>
					)}
					<Auth.AuthGuard roles={[Auth.ADMIN, [Auth.INDICATOR_CONTRIBUTOR, checkStamp]]}>
						<ValidationButton
							object={attr}
							callback={(object) =>
								this.publish(object, this.props.publishIndicator)
							}
							disabled={publicationDisabled}
						/>
						<Button
							action={`/operations/indicator/${attr.id}/modify`}
							label={D.btnUpdate}
						/>
					</Auth.AuthGuard>
				</ActionToolbar>
				<ErrorBloc error={serverSideError} />

				<CheckSecondLang />
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
		object: indicator.id === id ? indicator : {},
		langs: select.getLangs(state),
		secondLang: Stores.SecondLang.getSecondLang(state),
		frequency: frequencies.codes.find(
			(c) => c.code === indicator.accrualPeriodicityCode
		),
		organisations,
	};
};
const mapDispatchToProps = {
	load: loadIndicator,
	publishIndicator,
};
export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(IndicatorVisualizationContainer)
);
