import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'react-bootstrap';
import NoteEdition from 'js/components/shared/note-edition';
import D from 'js/i18n';
import { propTypes as notePropTypes } from 'js/utils/concepts/notes';
import { htmlIsEmpty } from 'js/utils/html';

const noteTypes = maxLengthScopeNote => [
	{
		rawTitle: D.conceptsScopeNote,
		// should be highlighted only if `scopeNoteLg1` is empty and
		//`disseminationStatus.includes('Public')`
		redLg1Empty: disseminationStatus => disseminationStatus.includes('Public'),
		noteLg1Name: 'scopeNoteLg1',
		noteLg2Name: 'scopeNoteLg2',
		maxLength: maxLengthScopeNote,
	},
	{
		rawTitle: D.conceptsDefinition,
		redLg1Empty: () => true,
		noteLg1Name: 'definitionLg1',
		noteLg2Name: 'definitionLg2',
	},

	{
		rawTitle: D.conceptsEditorialNote,
		noteLg1Name: 'editorialNoteLg1',
		noteLg2Name: 'editorialNoteLg2',
	},
	{
		rawTitle: D.conceptsChangeNote,
		noteLg1Name: 'changeNoteLg1',
		noteLg2Name: 'changeNoteLg2',
	},
];
//TODO structuring data in the state to make `fr` and `en` two attributes of an
//object might be a better option to organize the code efficiently.

const handleFieldChange = (handleChange, maxLengthScopeNote) =>
	noteTypes(maxLengthScopeNote).reduce(
		(handlers, { noteLg1Name, noteLg2Name }) => {
			handlers[noteLg1Name] = value => handleChange({ [noteLg1Name]: value });
			handlers[noteLg2Name] = value => handleChange({ [noteLg2Name]: value });
			return handlers;
		},
		{}
	);

class NotesEdition extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: 0,
		};
		const { handleChange, maxLengthScopeNote } = this.props;
		this.handlers = handleFieldChange(handleChange, maxLengthScopeNote);
		this.selectTab = tabIndex =>
			this.setState({
				activeTab: tabIndex,
			});
	}
	render() {
		const {
			notes,
			disseminationStatus,
			maxLengthScopeNote,
			langs,
		} = this.props;
		const { activeTab } = this.state;
		return (
			<ul className="nav nav-tabs nav-justified">
				<Tabs
					defaultActiveKey={0}
					id="kindOfNote"
					onSelect={this.selectTab}
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
								htmlIsEmpty(noteLg1) &&
								redLg1Empty(disseminationStatus);
							const title = highlight ? (
								<div className="red">{rawTitle}</div>
							) : (
								rawTitle
							);
							if (activeTab === i) {
								noteEdition = (
									<NoteEdition
										noteLg1={noteLg1}
										noteLg2={noteLg2}
										handleChangeLg1={this.handlers[noteLg1Name]}
										handleChangeLg2={this.handlers[noteLg2Name]}
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
	}
}
NotesEdition.propTypes = {
	conceptGeneral: notePropTypes,
	disseminationStatus: PropTypes.string.isRequired,
	handleChange: PropTypes.func.isRequired,
	langs: PropTypes.object.isRequired,
};

export default NotesEdition;
