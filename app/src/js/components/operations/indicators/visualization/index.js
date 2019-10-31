import React from 'react';
import { withRouter } from 'react-router-dom';
import D from 'js/i18n';
import buildExtract from 'js/utils/build-extract';
import { goBack } from 'js/utils/redirection';
import { connect } from 'react-redux';
import * as select from 'js/reducers';
import { CheckSecondLang } from 'bauhaus-library';
import { saveSecondLang } from 'js/actions/app';
import OperationsIndicatorVisualization from 'js/components/operations/indicators/visualization/general';
import { Loading, Button, ErrorBloc } from 'bauhaus-library';
import loadIndicator, {
	publishIndicator,
} from 'js/actions/operations/indicators/item';
import { CL_FREQ } from 'js/actions/constants/codeList';
import { getSecondLang } from 'js/reducers/app';
import Auth from 'js/utils/auth/components/auth';
import { INDICATOR_CREATOR, ADMIN, SERIES_CREATOR } from 'js/utils/auth/roles';
import PageTitleBlock from 'js/components/shared/page-title-block';
import { containUnsupportedStyles } from 'js/utils/html';
import VisualizationContainer from 'js/components/operations/shared/vizualisation-container';

import ValidationButton from 'js/components/operations/shared/validationButton';

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
		const publicationDisabled = containUnsupportedStyles(attr);

		return (
			<div className="container">
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
					<ErrorBloc error={serverSideError} />
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
						<ValidationButton
							object={attr}
							callback={object =>
								this.publish(object, this.props.publishIndicator)
							}
							disabled={publicationDisabled}
						/>
					</Auth>
					<Auth roles={[ADMIN, INDICATOR_CREATOR]}>
						<Button
							action={`/operations/indicator/${attr.id}/modify`}
							label={D.btnUpdate}
						/>
					</Auth>
				</div>

				<CheckSecondLang
					secondLang={secondLang}
					onChange={this.props.saveSecondLang}
				/>

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
		secondLang: getSecondLang(state),
		frequency: frequencies.codes.find(
			c => c.code === indicator.accrualPeriodicityCode
		),
		organisations,
	};
};
const mapDispatchToProps = {
	saveSecondLang,
	load: loadIndicator,
	publishIndicator,
};
export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(IndicatorVisualizationContainer)
);
