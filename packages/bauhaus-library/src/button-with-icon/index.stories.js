import React from 'react';
import { storiesOf } from '@storybook/react';
import { I18NContext } from '../context';
import AbstractButton, {
	ExportButton,
	PublishButton,
	NewButton,
	CancelButton,
	SaveButton,
	DuplicateButton,
} from './';

storiesOf('Button With Icons', module)
	.addDecorator(function(getStory) {
		return (
			<I18NContext.Provider
				value={{
					btnExport: 'Export',
					btnValid: 'Publish',
					btnNewMale: 'New',
					btnCancel: 'Cancel',
					btnSave: 'Save',
					btnDuplicate: 'Duplicate',
				}}
			>
				{getStory()}
			</I18NContext.Provider>
		);
	})
	.add('AbstractButton', () => <AbstractButton label="Button" icon="export" />)
	.add('ExportButton', () => <ExportButton />)
	.add('PublishButton', () => <PublishButton />)
	.add('NewButton', () => <NewButton />)
	.add('CancelButton', () => <CancelButton />)
	.add('SaveButton', () => <SaveButton />)
	.add('DuplicateButton', () => <DuplicateButton />);
