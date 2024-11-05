import { NoteEdition } from '../../components/note-edition';
import { D1 } from '../../deprecated-locales';
import { htmlIsEmpty, htmlLength } from '../../utils/html-utils';
import { TabPanel, TabView } from 'primereact/tabview';

const noteTypes = (maxLengthScopeNote: number) => [
	{
		rawTitle: 'conceptsScopeNote',
		noteLg1Name: 'scopeNoteLg1',
		noteLg2Name: 'scopeNoteLg2',
		maxLength: maxLengthScopeNote,
	},
	{
		rawTitle: 'conceptsDefinition',
		noteLg1Name: 'definitionLg1',
		noteLg2Name: 'definitionLg2',
	},

	{
		rawTitle: 'conceptsEditorialNote',
		noteLg1Name: 'editorialNoteLg1',
		noteLg2Name: 'editorialNoteLg2',
	},
	{
		rawTitle: 'conceptsChangeNote',
		noteLg1Name: 'changeNoteLg1',
		noteLg2Name: 'changeNoteLg2',
	},
];

const handleFieldChange = (handleChange, maxLengthScopeNote) =>
	noteTypes(maxLengthScopeNote).reduce(
		(handlers, { noteLg1Name, noteLg2Name }) => {
			handlers[noteLg1Name] = (value) => handleChange({ [noteLg1Name]: value });
			handlers[noteLg2Name] = (value) => handleChange({ [noteLg2Name]: value });
			return handlers;
		},
		{},
	);

const NotesEdition = ({
	notes,
	disseminationStatus,
	maxLengthScopeNote,
	handleChange,
	errorMessage,
}) => {
	const handlers = handleFieldChange(handleChange, maxLengthScopeNote);

	return (
		<TabView>
			{noteTypes(maxLengthScopeNote).map(
				({ rawTitle, noteLg1Name, noteLg2Name, maxLength }, i) => {
					const noteLg1 = notes[noteLg1Name];
					const noteLg2 = notes[noteLg2Name];

					//we value the note to know if the title should be highlighted or not
					const highlight =
						(noteLg1Name === 'definitionLg1' && htmlIsEmpty(noteLg1)) ||
						(noteLg1Name === 'scopeNoteLg1' &&
							htmlIsEmpty(noteLg1) &&
							disseminationStatus?.includes('Public')) ||
						(noteLg1Name === 'scopeNoteLg1' &&
							(htmlLength(noteLg1) > maxLength ||
								htmlLength(noteLg2) > maxLength));
					const title = highlight ? (
						<div className="red">{D1[rawTitle]}</div>
					) : (
						D1[rawTitle]
					);

					return (
						<TabPanel key={i} header={title}>
							<NoteEdition
								notes={notes}
								noteLg1Name={noteLg1Name}
								noteLg2Name={noteLg2Name}
								handleChangeLg1={handlers[noteLg1Name]}
								handleChangeLg2={handlers[noteLg2Name]}
								maxLength={maxLength}
								errorMessage={errorMessage}
							/>
						</TabPanel>
					);
				},
			)}
		</TabView>
	);
};

export default NotesEdition;
