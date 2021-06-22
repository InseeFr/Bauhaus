import React from 'react';
import D from 'js/i18n';
import * as select from 'js/reducers';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import OperationsSerieVisualization from 'js/applications/operations/series/visualization/home';

import {
	Loading,
	ErrorBloc,
	Button,
	ActionToolbar,
	goBack,
	buildExtract,
	ReturnButton,
} from '@inseefr/wilco';
import loadSerie, { publishSeries } from 'js/actions/operations/series/item';
import { CL_SOURCE_CATEGORY, CL_FREQ } from 'js/actions/constants/codeList';

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

class SeriesVisualizationContainer extends VisualizationContainer {
	render() {
		const {
			secondLang,
			langs,
			object: { ...attr },
			frequency,
			category,
			organisations,
		} = this.props;
		const { serverSideError } = this.state;

		const ableToCreateASimsForThisSeries = (attr.operations || []).length === 0;
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
					<ReturnButton action={goBack(this.props, '/operations/series')} />

					{attr.idSims && (
						<Button
							action={`/operations/sims/${attr.idSims}`}
							label={D.btnSimsVisu}
						/>
					)}
					{!attr.idSims && (
						<Auth.AuthGuard
							roles={[Auth.ADMIN, [Auth.SERIES_CONTRIBUTOR, checkStamp]]}
							complementaryCheck={ableToCreateASimsForThisSeries}
						>
							<Button
								action={`/operations/series/${attr.id}/sims/create`}
								label={D.btnSimsCreate}
							/>
						</Auth.AuthGuard>
					)}
					<Auth.AuthGuard roles={[Auth.ADMIN, [Auth.SERIES_CONTRIBUTOR, checkStamp]]}>
						<ValidationButton
							object={attr}
							callback={(object) =>
								this.publish(object, this.props.publishSeries)
							}
							disabled={publicationDisabled}
						/>
					</Auth.AuthGuard>
					<Auth.AuthGuard
						roles={[Auth.ADMIN, [Auth.SERIES_CONTRIBUTOR, checkStamp]]}
					>
						<Button
							action={`/operations/series/${attr.id}/modify`}
							label={D.btnUpdate}
						/>
					</Auth.AuthGuard>
				</ActionToolbar>

				<ErrorBloc error={serverSideError} />

				<CheckSecondLang />
				<OperationsSerieVisualization
					secondLang={secondLang}
					attr={attr}
					langs={langs}
					frequency={frequency}
					category={category}
					organisations={organisations}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	const serie = select.getSerie(state);
	const categories =
		state.operationsCodesList.results[CL_SOURCE_CATEGORY] || {};
	const frequencies = state.operationsCodesList.results[CL_FREQ] || {};
	const organisations = state.operationsOrganisations.results || [];

	return {
		id,
		object: serie.id === id ? serie : {},
		langs: select.getLangs(state),
		secondLang: Stores.SecondLang.getSecondLang(state),
		frequency: frequencies.codes.find(
			(c) => c.code === serie.accrualPeriodicityCode
		),
		category: categories.codes.find((c) => c.code === serie.typeCode),
		organisations,
	};
};
const mapDispatchToProps = {
	load: loadSerie,
	publishSeries,
};

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(SeriesVisualizationContainer)
);
