import React, { Component } from 'react';
import { goBack } from 'js/utils/redirection';
import D from 'js/i18n';
import * as select from 'js/reducers';
import CheckSecondLang from 'js/components/shared/second-lang-checkbox';
import { saveSecondLang } from 'js/actions/app';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import buildExtract from 'js/utils/build-extract';
import OperationsSerieVisualization from 'js/components/operations/series/visualization/home';
import Loading from 'js/components/shared/loading';
import loadSerie from 'js/actions/operations/series/item';
import { CL_SOURCE_CATEGORY, CL_FREQ } from 'js/actions/constants/codeList';
import Button from 'js/components/shared/button';
import { getSecondLang } from 'js/reducers/app';
import {
	INDICATOR_CREATOR,
	ADMIN,
	SERIES_CREATOR,
	CNIS,
} from 'js/utils/auth/roles';
import Auth from 'js/utils/auth/components/auth';
import PageTitleBlock from 'js/components/shared/page-title-block';

const extractId = buildExtract('id');

class SeriesVisualizationContainer extends Component {
	componentWillMount() {
		if (!this.props.serie.id) {
			this.props.loadSerie(this.props.id);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.id !== nextProps.id) {
			this.props.loadSerie(nextProps.id);
		}
	}
	render() {
		const {
			secondLang,
			langs,
			serie: { ...attr },
			frequency,
			category,
			organisations,
		} = this.props;

		const ableToCreateASimsForThisSeries = (attr.operations || []).length === 0;
		if (!attr.id) return <Loading textType="loading" context="operations" />;
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
					context="operations"
				/>

				<div className="row btn-line action-toolbar">
					<Button
						action={goBack(this.props, '/operations/series')}
						label={D.btnReturn}
						context="operations"
					/>

					<div className="empty-center" />

					{attr.idSims && (
						<Button
							action={`/operations/sims/${attr.idSims}`}
							label={D.btnSimsVisu}
							context="operations"
						/>
					)}
					{!attr.idSims && (
						<Auth
							roles={[ADMIN, SERIES_CREATOR, INDICATOR_CREATOR]}
							complementaryCheck={ableToCreateASimsForThisSeries}
						>
							<Button
								action={`/operations/series/${attr.id}/sims/create`}
								label={D.btnSimsCreate}
								context="operations"
							/>
						</Auth>
					)}
					<Auth roles={[ADMIN, SERIES_CREATOR]}>
						<Button label={D.btnValid} context="operations" />
					</Auth>
					<Auth roles={[ADMIN, SERIES_CREATOR, CNIS]}>
						<Button
							action={`/operations/series/${attr.id}/modify`}
							label={D.btnUpdate}
							context="operations"
						/>
					</Auth>
				</div>
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
	const serie = select.getSerie(state, id);
	const categories =
		state.operationsCodesList.results[CL_SOURCE_CATEGORY] || {};
	const frequencies = state.operationsCodesList.results[CL_FREQ] || {};
	const organisations = state.operationsOrganisations.results || [];

	return {
		id,
		serie: serie.id === id ? serie : {},
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
	loadSerie,
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(SeriesVisualizationContainer)
);
