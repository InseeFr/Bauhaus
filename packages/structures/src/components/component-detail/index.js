import React, { useCallback, useState } from 'react';
import { PageTitle, PageSubtitle, CheckSecondLang } from '@inseefr/wilco';
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
	//props.secondLang && props.component?.titleLg2 &&
	return (
		<div className="container">
			{mode === 'VIEW' && (
				<React.Fragment>
					<PageTitle title={props.component.labelLg1} />
					{<PageSubtitle subTitle={props.component.labelLg2} />}
					<CheckSecondLang
						secondLang={props.secondLang}
						onChange={props.saveSecondLang}
					/>

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
