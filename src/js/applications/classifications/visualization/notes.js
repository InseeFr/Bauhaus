import { ExplanatoryNote } from 'js/applications/shared/explanatory-note';
import { D1, D2 } from 'js/i18n';
import { Row } from 'js/new-architecture/components';
export default ({
	notes: {
		scopeNoteLg1,
		scopeNoteLg2,
		changeNoteLg1,
		changeNoteLg2,
		descriptionLg1,
		descriptionLg2,
	},
	secondLang,
	langs: { lg1, lg2 },
}) => (
	<div>
		<span>
			{descriptionLg1 && (
				<Row>
					<ExplanatoryNote
						text={descriptionLg1}
						title={D1.classificationsDescription}
						lang={lg1}
						alone={!secondLang}
						md
					/>
					{secondLang && (
						<ExplanatoryNote
							text={descriptionLg2}
							title={D2.classificationsDescription}
							lang={lg2}
							alone={false}
							md
						/>
					)}
				</Row>
			)}
		</span>
		<span>
			{scopeNoteLg1 && (
				<Row>
					<ExplanatoryNote
						text={scopeNoteLg1}
						title={D1.classificationsScopeNote}
						lang={lg1}
						alone={!secondLang}
						md
					/>
					{secondLang && (
						<ExplanatoryNote
							text={scopeNoteLg2}
							title={D2.classificationsScopeNote}
							lang={lg2}
							alone={false}
							md
						/>
					)}
				</Row>
			)}
		</span>
		<span>
			{changeNoteLg1 && (
				<Row>
					<ExplanatoryNote
						text={changeNoteLg1}
						title={D1.classificationsChangeNote()}
						lang={lg1}
						alone={!secondLang}
						md
					/>
					{secondLang && (
						<ExplanatoryNote
							text={changeNoteLg2}
							title={D2.classificationsChangeNote()}
							lang={lg2}
							alone={false}
							md
						/>
					)}
				</Row>
			)}
		</span>
	</div>
);
