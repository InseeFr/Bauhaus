import React, { Component } from 'react';
import CheckSecondLang from 'js/components/shared/second-lang-checkbox';
import PageTitle from 'js/components/shared/page-title';
import CorrespondenceControls from './controls';
import Panel from 'js/components/shared/panel';
import { generalFields } from './general-fields';
import { ExplanatoryNote } from 'js/components/shared/explanatory-note';
import D from 'js/i18n';
import { propTypes as correspondencePropTypes } from 'js/utils/classifications/correspondence/general';

class HomeGeneral extends Component {
	render() {
		const { correspondence, secondLang, langs: { lg1, lg2 } } = this.props;
		const {
			labelLg1,
			labelLg2,
			firstClassLabelLg2,
			secondClassLabelLg2,
		} = correspondence;
		const title = secondLang ? labelLg2 : labelLg1;
		return (
			<div>
				<CheckSecondLang
					secondLang={secondLang}
					onChange={this.props.saveSecondLang}
				/>
				{title && <PageTitle title={title} context="classifications" />}
				<CorrespondenceControls />
				<div className="row">
					<div className="col-md-12">
						{(!secondLang ||
							(secondLang && (firstClassLabelLg2 || secondClassLabelLg2))) && (
							<Panel
								title={D.globalInformationsTitle}
								context="classifications"
							>
								{generalFields(correspondence, secondLang)}
							</Panel>
						)}
					</div>
				</div>
				<span>
					{correspondence.descriptionLg1 && (
						<div className="row">
							<ExplanatoryNote
								text={correspondence.descriptionLg1}
								title={D.classificationsDescription}
								lang={lg1}
								alone={!secondLang}
								context="classifications"
							/>
							{secondLang && (
								<ExplanatoryNote
									text={correspondence.descriptionLg2}
									title={D.classificationsDescription}
									lang={lg2}
									alone={false}
									context="classifications"
								/>
							)}
						</div>
					)}
				</span>
			</div>
		);
	}
}

HomeGeneral.propTypes = {
	correspondence: correspondencePropTypes.isRequired,
};

export default HomeGeneral;
