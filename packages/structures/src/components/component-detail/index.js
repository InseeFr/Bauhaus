import React, { useCallback, useState } from 'react';
import { ComponentDetailEdit } from './edit';
import { ComponentDetailView } from './view';
import ComponentTitle from './title';

export const ComponentDetail = props => {
	const [mode, setMode] = useState(
		!props.component?.labelLg1 ? 'EDIT' : 'VIEW'
	);

	const handleViewUpdate = useCallback(() => setMode('EDIT'), []);
	const handleEditUpdate = useCallback(
		component => {
			props.handleSave(component);
			setMode('VIEW');
		},
		[props]
	);
	const handleEditBack = useCallback(
		() => (!props.component.labelLg1 ? props.handleBack() : setMode('VIEW')),
		[props]
	);

	return (
		<div className="container">
			{mode === 'VIEW' && (
				<React.Fragment>
					<ComponentTitle component={props.component} />

					<ComponentDetailView
						{...props}
						handleUpdate={handleViewUpdate}
						handleBack={props.handleBack}
					/>
				</React.Fragment>
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

//
