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

const extractId = buildExtract('id');

class SeriesVisualizationContainer extends Component {
	componentWillMount() {
		if (!this.props.serie.id) {
			this.props.loadSerie(this.props.id);
		}
	}
	render() {
		const {
			secondLang,
			langs,
			serie: { ...attr },
		} = this.props;
		if (!attr.id) return <Loading textType="loading" context="operations" />;
		return (
			<div className="container">
				<CheckSecondLang
					secondLang={secondLang}
					onChange={this.props.saveSecondLang}
				/>
				<div className="row">
					<div className="col-md-2">
						<button
							className="btn btn-primary btn-lg col-md-12"
							onClick={goBack(this.props, '/operations/series')}
						>
							{D.btnReturn}
						</button>
					</div>
				</div>
				<PageTitle title={attr.prefLabelLg1} context="operations" />
				{secondLang &&
					attr.prefLabelLg2 && <PageSubtitle subTitle={attr.prefLabelLg2} />}

				<SerieInformation secondLang={secondLang} attr={attr} langs={langs} />
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	return {
		id,
		serie: select.getSerie(state, id),
		langs: select.getLangs(state),
		secondLang: state.app.secondLang,
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
