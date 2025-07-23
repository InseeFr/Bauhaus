import { ExplanatoryNote } from '@components/explanatory-note';
import { Row } from '@components/layout';
import Editor from '@uiw/react-md-editor';

import { D1, D2 } from '../../deprecated-locales';

const Notes = ({
	notes: {
		scopeNoteLg1,
		scopeNoteLg2,
		changeNoteLg1,
		changeNoteLg2,
		descriptionLg1,
		descriptionLg2,
	},
	secondLang,
}) => (
	<div>
		<span>
			{descriptionLg1 && (
				<Row>
					<ExplanatoryNote
						text={<Editor.Markdown source={descriptionLg1} />}
						title={D1.classificationsDescription}
						alone={!secondLang}
					/>
					{secondLang && (
						<ExplanatoryNote
							text={<Editor.Markdown source={descriptionLg2} />}
							title={D2.classificationsDescription}
							alone={false}
						/>
					)}
				</Row>
			)}
		</span>
		<span>
			{scopeNoteLg1 && (
				<Row>
					<ExplanatoryNote
						text={<Editor.Markdown source={scopeNoteLg1} />}
						title={D1.classificationsScopeNote}
						alone={!secondLang}
					/>
					{secondLang && (
						<ExplanatoryNote
							text={<Editor.Markdown source={scopeNoteLg2} />}
							title={D2.classificationsScopeNote}
							alone={false}
						/>
					)}
				</Row>
			)}
		</span>
		<span>
			{changeNoteLg1 && (
				<Row>
					<ExplanatoryNote
						text={<Editor.Markdown source={changeNoteLg1} />}
						title={D1.classificationsChangeNote()}
						alone={!secondLang}
					/>
					{secondLang && (
						<ExplanatoryNote
							text={<Editor.Markdown source={changeNoteLg2} />}
							title={D2.classificationsChangeNote()}
							alone={false}
						/>
					)}
				</Row>
			)}
		</span>
	</div>
);

export default Notes;
