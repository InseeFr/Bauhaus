// TODO Not really container yet, fix with real data
import React, { Component } from 'react';
import PageTitle from 'js/components/shared/page-title';
import { goBack } from 'js/utils/redirection';
import D from 'js/i18n';
import * as select from 'js/reducers';
import CheckSecondLang from 'js/components/shared/second-lang-checkbox';
import { saveSecondLang } from 'js/actions/app';
import PageSubtitle from 'js/components/shared/page-subtitle';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import buildExtract from 'js/utils/build-extract';
import SerieInformation from 'js/components/operations/series/visualization/general';
import Loading from 'js/components/shared/loading';
import loadSerie from 'js/actions/operations/series/item';
import { Link } from 'react-router-dom';
import loadCodesList from 'js/actions/operations/series/codesList';
import { CL_SOURCE_CATEGORY, CL_FREQ } from 'js/actions/constants/codeList';

const extractId = buildExtract('id');

class SeriesVisualizationContainer extends Component {
	componentWillMount() {
		if (!this.props.serie.id) {
			this.props.loadSerie(this.props.id);
			this.props.loadCodesList(CL_FREQ);
			this.props.loadCodesList(CL_SOURCE_CATEGORY);
		}
	}
	render() {
		const {
			secondLang,
			langs,
			serie: { ...attr },
			frequency,
			category,
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
					attr.prefLabelLg2 && <PageSubtitle subTitle={attr.prefLabelLg2} />}

				<div className="row btn-line">
					<div className="col-md-2">
						<button
							className="btn btn-primary btn-lg col-md-12"
							onClick={goBack(this.props, '/operations/series')}
						>
							{D.btnReturn}
						</button>
					</div>
					<div className="col-md-6 centered" />
					<div className="col-md-2">
						<button className="btn btn-primary btn-lg pull-right col-md-12">
							{D.btnSend}
						</button>
					</div>
					<div className="col-md-2">
						<Link
							className="btn btn-primary btn-lg pull-right col-md-12"
							to={`/operations/series/${attr.id}/modify`}
						>
							{D.btnUpdate}
						</Link>
					</div>
				</div>
				<SerieInformation
					secondLang={secondLang}
					attr={attr}
					langs={langs}
					frequency={frequency}
					category={category}
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
	return {
		id,
		serie,
		langs: select.getLangs(state),
		secondLang: state.app.secondLang,
		frequency: frequencies.codes.find(
			c => c.code === serie.accrualPeriodicityCode
		),
		category: categories.codes.find(c => c.code === serie.typeCode),
	};
};
const mapDispatchToProps = {
	saveSecondLang,
	loadSerie,
	loadCodesList,
};

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(SeriesVisualizationContainer)
);
