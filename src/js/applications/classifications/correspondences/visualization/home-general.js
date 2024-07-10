import { Note } from '@inseefr/wilco';
import { PageTitle } from 'js/new-architecture/components';
import CorrespondenceControls from './controls';
import { generalFields } from './general-fields';
import { ExplanatoryNote } from 'js/applications/shared/explanatory-note';
import { D1, D2 } from 'js/i18n';
import { CheckSecondLang, Row, useTitle } from 'js/utils';
import D from '../../../../i18n/build-dictionary';

const HomeGeneral = ({ correspondence, secondLang, langs: { lg1, lg2 } }) => {
	const { labelLg1, labelLg2, firstClassLabelLg2, secondClassLabelLg2 } =
		correspondence;
	const title = secondLang ? labelLg2 : labelLg1;

	useTitle(D.correspondencesTitle, labelLg1);

	return (
		<div>
			{title && <PageTitle title={title} />}
			<CorrespondenceControls />
			<CheckSecondLang />
			<Row>
				{(!secondLang ||
					(secondLang && (firstClassLabelLg2 || secondClassLabelLg2))) && (
					<Note
						text={generalFields(correspondence, secondLang)}
						title={D1.globalInformationsTitle}
						alone={true}
						allowEmpty={true}
					/>
				)}
			</Row>
			<span>
				{correspondence.descriptionLg1 && (
					<Row>
						<ExplanatoryNote
							text={correspondence.descriptionLg1}
							title={D1.classificationsDescription}
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
					</Row>
				)}
			</span>
		</div>
	);
};

export default HomeGeneral;
