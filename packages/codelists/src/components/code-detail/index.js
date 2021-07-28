import React, { useCallback, useState } from 'react';
import { CodeDetailEdit } from './edit';
import { CodeDetailView } from './view';
import CodeTitle from './title';
import { useSelector } from 'react-redux';
import { Stores } from 'bauhaus-utilities';

export const CodeDetail = (props) => {
	const secondLang = useSelector(Stores.SecondLang.getSecondLang);

	const [mode, setMode] = useState(
		!props.readOnly && !props.code?.labelLg1 ? 'EDIT' : 'VIEW'
	);

	const handleViewUpdate = useCallback(() => setMode('EDIT'), []);
	const handleEditUpdate = useCallback(
		(code) => {
			props.handleSave(code);
			setMode('VIEW');
		},
		[props]
	);
	const handleEditBack = useCallback(
		() => (!props.code.labelLg1 ? props.handleBack() : setMode('VIEW')),
		[props]
	);
	return (
		<div className="container">
			{mode === 'VIEW' && (
				<React.Fragment>
					<CodeTitle code={props.code} secondLang={secondLang} />

					<CodeDetailView
						{...props}
						secondLang={secondLang}
						handleUpdate={handleViewUpdate}
						handleBack={props.handleBack}
						updatable={!props.readOnly}
					/>
				</React.Fragment>
			)}
			{mode === 'EDIT' && (
				<CodeDetailEdit
					{...props}
					secondLang={true}
					handleSave={handleEditUpdate}
					handleBack={handleEditBack}
				/>
			)}
		</div>
	);
};
