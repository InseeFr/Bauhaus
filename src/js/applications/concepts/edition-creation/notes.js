import { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import NoteEdition from '../../../applications/shared/note-edition';
import { D1 } from '../../../i18n';
import { HTMLUtils } from '../../../utils';

const noteTypes = (maxLengthScopeNote) => [
	{
		rawTitle: 'conceptsScopeNote',
		// should be highlighted only if `scopeNoteLg1` is empty and
		//`disseminationStatus.includes('Public')`
		redLg1Empty: (disseminationStatus) =>
			disseminationStatus.includes('Public'),
		noteLg1Name: 'scopeNoteLg1',
		noteLg2Name: 'scopeNoteLg2',
		maxLength: maxLengthScopeNote,
	},
	{
		rawTitle: 'conceptsDefinition',
		redLg1Empty: () => true,
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
		{}
	);

const NotesEdition = ({
	notes,
	disseminationStatus,
	maxLengthScopeNote,
	langs,
	handleChange,
}) => {
	const [activeTab, setActiveTab] = useState(0);
	const handlers = handleFieldChange(handleChange, maxLengthScopeNote);

	return (
		<ul className="nav nav-tabs nav-justified">
			<Tabs
				defaultActiveKey={0}
				id="kindOfNote"
				onSelect={setActiveTab}
				justified
			>
				{noteTypes(maxLengthScopeNote).map(
					(
						{ rawTitle, noteLg1Name, noteLg2Name, redLg1Empty, maxLength },
						i
					) => {
						const noteLg1 = notes[noteLg1Name];
						const noteLg2 = notes[noteLg2Name];
						//note fr empty and we value the `redFrEmptpy` function to know if
						//given the dissemination status, it should be highlighted or not
						let noteEdition;
						const highlight =
							redLg1Empty &&
							HTMLUtils.htmlIsEmpty(noteLg1) &&
							redLg1Empty(disseminationStatus);
						const title = highlight ? (
							<div className="red">{D1[rawTitle]}</div>
						) : (
							D1[rawTitle]
						);
						if (activeTab === i) {
							noteEdition = (
								<NoteEdition
									noteLg1={noteLg1}
									noteLg2={noteLg2}
									handleChangeLg1={handlers[noteLg1Name]}
									handleChangeLg2={handlers[noteLg2Name]}
									maxLength={maxLength}
									langs={langs}
								/>
							);
						}

						return (
							<Tab
								key={noteLg1Name}
								eventKey={i}
								title={title}
								style={{ marginTop: '20px' }}
							>
								{noteEdition}
							</Tab>
						);
					}
				)}
			</Tabs>
		</ul>
	);
};

export default NotesEdition;
