import { PageTitle, Note } from '@inseefr/wilco';
import CorrespondenceControls from './controls';
import { generalFields } from './general-fields';
import { ExplanatoryNote } from 'js/applications/shared/explanatory-note';
import { D2, D1 } from 'js/i18n';
import { CheckSecondLang, Row } from 'js/utils';

export default ({ association, secondLang, langs }) => {
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
			<PageTitle title={title} subtitle={associationId} />
			<CorrespondenceControls correspondenceId={correspondenceId} />
			<CheckSecondLang />

			<Row>
				{(!secondLang ||
					(secondLang && sourceItemLabelLg2 && targetItemLabelLg2)) && (
					<Note
						text={generalFields(association, secondLang)}
						title={D1.globalInformationsTitle}
						alone={true}
						allowEmpty={true}
					/>
				)}
			</Row>
			<span>
				{scopeNoteLg1 && (
					<Row>
						<ExplanatoryNote
							text={scopeNoteLg1}
							title={D1.classificationsDescription}
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
					</Row>
				)}
			</span>
		</div>
	);
};
