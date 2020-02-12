import React from 'react';
import { goBack } from 'bauhaus-library/src/utils/redirection';
import D from 'js/i18n';
import * as select from 'js/reducers';
import { saveSecondLang } from 'js/actions/app';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import buildExtract from 'bauhaus-library/src/utils/build-extract';
import OperationsSerieVisualization from 'js/applications/operations/series/visualization/home';
import {
	CheckSecondLang,
	Loading,
	ErrorBloc,
	Button,
	ActionToolbar,
} from 'bauhaus-library';
import loadSerie, { publishSeries } from 'js/actions/operations/series/item';
import { CL_SOURCE_CATEGORY, CL_FREQ } from 'js/actions/constants/codeList';
import { getSecondLang } from 'js/reducers/app';
import { ADMIN, CNIS, SERIES_CONTRIBUTOR } from 'js/utils/auth/roles';
import Auth from 'js/utils/auth/components/auth';
import PageTitleBlock from 'js/applications/shared/page-title-block';
import { containUnsupportedStyles } from 'js/utils/html';
import ValidationButton from 'js/applications/operations/shared/validationButton';
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
		const publicationDisabled = containUnsupportedStyles(attr);

		return (
			<div className="container">
				<PageTitleBlock
					titleLg1={attr.prefLabelLg1}
					titleLg2={attr.prefLabelLg2}
					secondLang={secondLang}
				/>

				<ActionToolbar>
					<Button
						action={goBack(this.props, '/operations/series')}
						label={D.btnReturn}
					/>

					{attr.idSims && (
						<Button
							action={`/operations/sims/${attr.idSims}`}
							label={D.btnSimsVisu}
						/>
					)}
					{!attr.idSims && (
						<Auth
							roles={[ADMIN, SERIES_CONTRIBUTOR]}
							complementaryCheck={ableToCreateASimsForThisSeries}
						>
							<Button
								action={`/operations/series/${attr.id}/sims/create`}
								label={D.btnSimsCreate}
							/>
						</Auth>
					)}
					<Auth roles={[ADMIN, SERIES_CONTRIBUTOR]}>
						<ValidationButton
							object={attr}
							callback={object =>
								this.publish(object, this.props.publishSeries)
							}
							disabled={publicationDisabled}
						/>
					</Auth>
					<Auth roles={[ADMIN, CNIS, SERIES_CONTRIBUTOR]}>
						<Button
							action={`/operations/series/${attr.id}/modify`}
							label={D.btnUpdate}
						/>
					</Auth>
				</ActionToolbar>

				<ErrorBloc error={serverSideError} />

				<CheckSecondLang
					secondLang={secondLang}
					onChange={this.props.saveSecondLang}
				/>
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
		secondLang: getSecondLang(state),
		frequency: frequencies.codes.find(
			c => c.code === serie.accrualPeriodicityCode
		),
		category: categories.codes.find(c => c.code === serie.typeCode),
		organisations,
	};
};
const mapDispatchToProps = {
	saveSecondLang,
	load: loadSerie,
	publishSeries,
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(SeriesVisualizationContainer)
);
