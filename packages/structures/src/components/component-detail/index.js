import React, { useCallback, useState } from 'react';
import { PageTitle } from '@inseefr/wilco';
import { ComponentDetailEdit } from './edit';
import { ComponentDetailView } from './view';

export const ComponentDetail = props => {
	const [mode, setMode] = useState(!props.component.labelLg1 ? 'EDIT' : 'VIEW');

	const handleViewUpdate = useCallback(() => setMode('EDIT'), []);
	const handleEditUpdate = useCallback(() => setMode('VIEW'), []);
	const handleEditBack = useCallback(
		() => (!props.component.labelLg1 ? props.handleBack() : setMode('VIEW')),
		[props]
	);
	// TODO
	// - Afficher le titre en deuxieme langue
	// - Affiche le composant permettant de switcher la 2e langue
	return (
		<div className="container">
			<PageTitle title={props.component.labelLg1} />
			{mode === 'VIEW' && (
				<ComponentDetailView
					{...props}
					handleUpdate={handleViewUpdate}
					handleBack={props.handleBack}
				/>
			)}
			{mode === 'EDIT' && (
				<ComponentDetailEdit
					{...props}
					handleSave={handleEditUpdate}
					handleBack={handleEditBack}
				/>
			)}
		</div>
	);
};
