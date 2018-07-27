// TODO Not really container yet, fix with real data
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
import FamilyInformation from 'js/components/operations/families/visualization/general';
import Loading from 'js/components/shared/loading';
import loadFamily from 'js/actions/operations/families/item';
import { Link } from 'react-router-dom';

const extractId = buildExtract('id');
class FamilyVisualizationContainer extends Component {
	componentWillMount() {
		if (!this.props.family.id) {
			this.props.loadFamily(this.props.id);
		}
	}
	render() {
		const { secondLang, langs, family: { ...attr } } = this.props;
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
							onClick={goBack(this.props, '/operations/families')}
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
							to={`/operations/family/${attr.id}/modify`}
						>
							{D.btnUpdate}
						</Link>
					</div>
				</div>
				<FamilyInformation secondLang={secondLang} attr={attr} langs={langs} />
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	return {
		id,
		family: select.getFamily(state, id),
		langs: select.getLangs(state),
		secondLang: state.app.secondLang,
	};
};
const mapDispatchToProps = {
	saveSecondLang,
	loadFamily,
};
export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(FamilyVisualizationContainer)
);
