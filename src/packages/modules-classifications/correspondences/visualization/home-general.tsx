import CorrespondenceControls from './controls';
import { generalFields } from './general-fields';
import { D1, D2 } from '../../../deprecated-locales';

import D from '../../../deprecated-locales/build-dictionary';
import { useTitle } from '@utils/hooks/useTitle';
import { Note } from '@components/note';
import { PageTitle } from '@components/page-title';
import { CheckSecondLang } from '@components/check-second-lang';
import { Row } from '@components/layout';
import { ExplanatoryNote } from '@components/explanatory-note';

const HomeGeneral = ({
	correspondence,
	secondLang,
}: {
	correspondence: any;
	secondLang: boolean;
}) => {
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
							alone={!secondLang}
						/>
						{secondLang && (
							<ExplanatoryNote
								text={correspondence.descriptionLg2}
								title={D2.classificationsDescription}
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
