import D from 'js/i18n';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import * as select from 'js/reducers';
import { connect } from 'react-redux';
import { goBack } from 'js/utils/redirection';
import { withRouter } from 'react-router-dom';
import { getSecondLang } from 'js/reducers/app';
import { saveSecondLang } from 'js/actions/app';
import Auth from 'js/utils/auth/components/auth';
import Button from 'js/components/shared/button';
import buildExtract from 'js/utils/build-extract';
import { ADMIN, CNIS } from 'js/utils/auth/roles';
import Loading from 'js/components/shared/loading';
import React, { PureComponent } from 'react';
import PageTitleBlock from 'js/components/shared/page-title-block';
import CheckSecondLang from 'js/components/shared/second-lang-checkbox';
import loadFamily, { publishFamily } from 'js/actions/operations/families/item';
import OperationsFamilyVisualization from 'js/components/operations/families/visualization/visualization';
import ValidationButton from 'js/components/operations/shared/validationButton';

const extractId = buildExtract('id');

class FamilyVisualizationContainer extends PureComponent {
	static propTypes = {
		family: PropTypes.object,
		secondLang: PropTypes.bool,
		langs: PropTypes.object,
		saveSecondLang: PropTypes.func,
		loadFamily: PropTypes.func,
		publishFamily: PropTypes.func,
	};
	componentDidMount() {
		this.loadFamily(this.props.family, this.props.id);
	}
	componentDidUpdate() {
		this.loadFamily(this.props.family, this.props.id);
	}

	loadFamily(family, id) {
		if (!family.id) {
			this.props.loadFamily(id);
		}
	}
	render() {
		const {
			secondLang,
			langs,
			family: { ...attr },
			saveSecondLang,
			publishFamily,
		} = this.props;
		if (!attr.id) return <Loading textType="loading" />;
		return (
			<div className="container">
				<CheckSecondLang secondLang={secondLang} onChange={saveSecondLang} />

				<PageTitleBlock
					titleLg1={attr.prefLabelLg1}
					titleLg2={attr.prefLabelLg2}
					secondLang={secondLang}
				/>

				<div className="row btn-line action-toolbar">
					<Button
						action={goBack(this.props, '/operations/families')}
						label={D.btnReturn}
					/>

					<div className="empty-center" />
					<Auth roles={[ADMIN]}>
						<ValidationButton object={attr} callback={publishFamily} />
					</Auth>
					<Auth roles={[ADMIN, CNIS]}>
						<Button
							action={`/operations/family/${attr.id}/modify`}
							label={D.btnUpdate}
						/>
					</Auth>
				</div>
				<OperationsFamilyVisualization
					secondLang={secondLang}
					attr={attr}
					langs={langs}
				/>
			</div>
		);
	}
}

export const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	const family = select.getFamily(state);
	return {
		id,
		family: family.id === id ? family : {},
		langs: select.getLangs(state),
		secondLang: getSecondLang(state),
	};
};
const mapDispatchToProps = {
	saveSecondLang,
	loadFamily,
	publishFamily,
};
export default compose(
	withRouter,
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(FamilyVisualizationContainer);
