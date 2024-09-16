import { D1, D2 } from '../../../deprecated-locales';
import { Row, ExplanatoryNote } from '../../../components';

const Notes = ({ notes: { scopeNoteLg1, scopeNoteLg2 }, secondLang }) => (
	<div>
		{scopeNoteLg1 && (
			<Row>
				<ExplanatoryNote
					text={scopeNoteLg1}
					title={D1.classificationsScopeNote}
					alone={!secondLang}
				/>
				{secondLang && (
					<ExplanatoryNote
						text={scopeNoteLg2}
						title={D2.classificationsScopeNote}
						alone={false}
					/>
				)}
			</Row>
		)}
	</div>
);

export default Notes;
