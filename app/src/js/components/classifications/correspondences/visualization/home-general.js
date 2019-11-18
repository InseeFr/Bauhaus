import React, { Component } from 'react';
import { CheckSecondLang, PageTitle, Panel } from 'bauhaus-library';
import CorrespondenceControls from './controls';
import { generalFields } from './general-fields';
import { ExplanatoryNote } from 'js/components/shared/explanatory-note';
import D, { D2 } from 'js/i18n';
import { propTypes as correspondencePropTypes } from 'js/utils/classifications/correspondence/general';

class HomeGeneral extends Component {
	static propTypes = {
		correspondence: correspondencePropTypes.isRequired,
	};
	render() {
		const {
			correspondence,
			secondLang,
			langs: { lg1, lg2 },
		} = this.props;
		const {
			labelLg1,
			labelLg2,
			firstClassLabelLg2,
			secondClassLabelLg2,
		} = correspondence;
		const title = secondLang ? labelLg2 : labelLg1;
		return (
			<div>
				{title && <PageTitle title={title} context="classifications" />}
				<CorrespondenceControls />
				<CheckSecondLang
					secondLang={secondLang}
					onChange={this.props.saveSecondLang}
				/>
				<div className="row">
					<div className="col-md-12">
						{(!secondLang ||
							(secondLang && (firstClassLabelLg2 || secondClassLabelLg2))) && (
							<Panel title={D.globalInformationsTitle}>
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
							/>
							{secondLang && (
								<ExplanatoryNote
									text={correspondence.descriptionLg2}
									title={D2.classificationsDescription}
									lang={lg2}
									alone={false}
								/>
							)}
						</div>
					)}
				</span>
			</div>
		);
	}
}

export default HomeGeneral;
