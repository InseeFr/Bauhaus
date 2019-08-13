import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import D from 'js/i18n';
import buildExtract from 'js/utils/build-extract';
import { goBack } from 'js/utils/redirection';
import { connect } from 'react-redux';
import * as select from 'js/reducers';
import CheckSecondLang from 'js/components/shared/second-lang-checkbox';
import { saveSecondLang } from 'js/actions/app';
import OperationsFamilyVisualization from 'js/components/operations/families/visualization/visualization';
import Loading from 'js/components/shared/loading';
import loadFamily from 'js/actions/operations/families/item';
import Button from 'js/components/shared/button';
import { getSecondLang } from 'js/reducers/app';
import { ADMIN, CNIS } from 'js/utils/auth/roles';
import Auth from 'js/utils/auth/components/auth';
import PageTitleBlock from 'js/components/shared/page-title-block';
import { containUnsupportedStyles } from 'js/utils/html';

const extractId = buildExtract('id');
class FamilyVisualizationContainer extends PureComponent {
	static propTypes = {
		family: PropTypes.object,
		secondLang: PropTypes.bool,
		langs: PropTypes.object,
		saveSecondLang: PropTypes.func,
	};
	componentDidMount() {
		if (!this.props.family.id) {
			this.props.loadFamily(this.props.id);
		}
	}
	render() {
		const {
			secondLang,
			langs,
			family: { ...attr },
			saveSecondLang,
		} = this.props;
		if (!attr.id) return <Loading textType="loading" />;

		/*
		 * The publication button should be enabled only if RICH_TEXT value do not
		 * have unsupported styles like STRIKETHROUGH, color or background color
		 */
		const publicationEnabled = !!containUnsupportedStyles(attr);
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
						<Button disabled={publicationEnabled} label={D.btnValid} />
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
	const family = select.getFamily(state, id);
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
};
export default compose(
	withRouter,
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(FamilyVisualizationContainer);
