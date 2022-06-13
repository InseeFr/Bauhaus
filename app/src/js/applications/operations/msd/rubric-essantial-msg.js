import { Note } from '@inseefr/wilco';
import D from '../../../i18n/build-dictionary';
import { useSimsContext } from './context';

export const RubricEssentialMsg = ({ secondLang }) => {

	const simsContext = useSimsContext();
	const numberOfEssantialRubricsKOLg1 = Object.values(simsContext).filter(rubric => rubric.essentialRubricKoLg1).length;
	const numberOfEssantialRubricsKOLg2 = Object.values(simsContext).filter(rubric => rubric.essentialRubricKoLg2).length;
	const numberOfEssantialRubrics = Object.values(simsContext).filter(rubric => rubric.minOccurs === "1").length;
	const numberOfEssantialRubricsOKLg1 = numberOfEssantialRubrics - numberOfEssantialRubricsKOLg1;
	const numberOfEssantialRubricsOKLg2 = numberOfEssantialRubrics - numberOfEssantialRubricsKOLg2;

	const i18nkeyLg1 = numberOfEssantialRubricsOKLg1 === 1 ? D.essentialRubricMsg : D.essentialRubricMsgPlural;
	const i18nkeyLg2 = numberOfEssantialRubricsOKLg2 === 1 ? D.essentialRubricMsg : D.essentialRubricMsgPlural;
	return (
		<div className="row">
			<Note
				text={
					i18nkeyLg1(numberOfEssantialRubricsOKLg1, numberOfEssantialRubrics)
				}
				title={D.essentialRubric}
				alone={!secondLang}
			/>
			{secondLang && (
				<Note
					text={
						i18nkeyLg2(numberOfEssantialRubricsOKLg2, numberOfEssantialRubrics)
					}
					title={D.essentialRubric}
					alone={!secondLang}
				/>
			)}
		</div>
	)
}
