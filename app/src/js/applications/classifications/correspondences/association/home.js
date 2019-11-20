import React from 'react';
import { CheckSecondLang, PageTitle, Panel } from 'bauhaus-library';
import CorrespondenceControls from './controls';
import { generalFields } from './general-fields';
import { ExplanatoryNote } from 'js/applications/shared/explanatory-note';
import D, { D2 } from 'js/i18n';

export default ({ association, secondLang, saveSecondLang, langs }) => {
	const {
		labelLg1,
		labelLg2,
		correspondenceId,
		associationId,
		scopeNoteLg1,
		scopeNoteLg2,
	} = association;
	const { lg1, lg2 } = langs;
	const title = secondLang ? labelLg2 : labelLg1;
	const { sourceItemLabelLg2, targetItemLabelLg2 } = association;
	return (
		<div className="container">
			<PageTitle
				title={title}
				subtitle={associationId}
				context="classifications"
			/>
			<CorrespondenceControls correspondenceId={correspondenceId} />
			<CheckSecondLang secondLang={secondLang} onChange={saveSecondLang} />

			<div className="row">
				<div className="col-md-12">
					{(!secondLang ||
						(secondLang && sourceItemLabelLg2 && targetItemLabelLg2)) && (
						<Panel title={D.globalInformationsTitle}>
							{generalFields(association, secondLang)}
						</Panel>
					)}
				</div>
			</div>
			<span>
				{scopeNoteLg1 && (
					<div className="row">
						<ExplanatoryNote
							text={scopeNoteLg1}
							title={D.classificationsDescription}
							lang={lg1}
							alone={!secondLang}
						/>
						{secondLang && (
							<ExplanatoryNote
								text={scopeNoteLg2}
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
};
