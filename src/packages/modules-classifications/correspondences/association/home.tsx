import CorrespondenceControls from './controls';
import { generalFields } from './general-fields';
import { D2, D1 } from '../../../deprecated-locales';
import { Note } from '@components/note';
import { PageTitle } from '@components/page-title';
import { CheckSecondLang } from '@components/check-second-lang';
import { Row } from '@components/layout';
import { ExplanatoryNote } from '@components/explanatory-note';

const Home = ({
	association,
	secondLang,
}: {
	association: any;
	secondLang: boolean;
}) => {
	const {
		labelLg1,
		labelLg2,
		correspondenceId,
		associationId,
		scopeNoteLg1,
		scopeNoteLg2,
	} = association;
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
							alone={!secondLang}
						/>
						{secondLang && (
							<ExplanatoryNote
								text={scopeNoteLg2}
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

export default Home;
