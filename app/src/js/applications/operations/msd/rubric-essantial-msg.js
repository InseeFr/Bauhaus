import { Note } from '@inseefr/wilco';
import D from '../../../i18n/build-dictionary';
import { useSimsContext } from './context';

export const RubricEssentialMsg = () => {
	const simsContext = useSimsContext();
	const numberOfEssantialRubricsKO = Object.values(simsContext).filter(rubric => rubric.essentialRubricKo).length;
	const numberOfEssantialRubrics = Object.values(simsContext).filter(rubric => rubric.minOccurs === "1").length;
	const numberOfEssantialRubricsOK = numberOfEssantialRubrics - numberOfEssantialRubricsKO;

	return (
		<div className="row">
			<Note
				text={
					D.essentialRubricMsg(numberOfEssantialRubricsOK, numberOfEssantialRubrics)
				}
				title={D.essentialRubric}
				alone={true}
			/>
		</div>
	)
}
