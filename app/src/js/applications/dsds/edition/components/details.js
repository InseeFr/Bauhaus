import React, { useState, useEffect } from 'react';
import { Input, Radio, Select } from '@inseefr/wilco';
import Controls from './controls';
import D from 'js/i18n';
import * as C from 'js/constants';

const defaultComponent = {
	id: '',
	labelLg1: '',
	labelLg2: '',
	type: '',
	attachment: '',
	concept: '',
	isCoded: false,
	codeList: '',
	range: '',
};

const ComponentDetail = ({
	component: initComponent,
	addComponent,
	deleteComponent,
	concepts,
	codeList,
}) => {
	const [component, setComponent] = useState(() => defaultComponent);

	useEffect(() => {
		setComponent({ ...defaultComponent, ...initComponent });
	}, [initComponent]);

	const onChange = update => {
		setComponent({ ...component, ...update });
	};

	const {
		id,
		labelLg1,
		labelLg2,
		type,
		attachment,
		concept,
		isCoded,
		range,
	} = component;

	return (
		<>
			<Input
				id="id"
				label={D.idTitle}
				value={id}
				onChange={e => onChange({ id: e.target.value })}
				helpMsg={!id && `Identifier can't be empty`}
			/>
			<Input
				id="labelLg1"
				label={D.labelTitle}
				value={labelLg1}
				onChange={e => onChange({ labelLg1: e.target.value })}
				lang="fr"
				helpMsg={!labelLg1 && `Label can't be empty`}
			/>
			<Input
				id="labelLg2"
				label={D.labelTitle}
				value={labelLg2}
				onChange={e => onChange({ labelLg2: e.target.value })}
				lang="en"
			/>
			<Select
				id="type"
				label={D.componentTypeTitle}
				value={C.COMPONENT_TYPES.find(c => c.value === type)}
				placeholder={D.componentTypePlaceholder}
				options={C.COMPONENT_TYPES}
				onChange={e => onChange({ type: e.value })}
				helpMsg={!type && `Type can't be undefined`}
			/>
			{type === C.ATTRIBUTE_TYPE && (
				<Select
					id="attachment"
					label={D.attachmentTitle}
					value={C.ATTACHMENTS.find(c => c.value === attachment)}
					placeholder={D.attachmentPlaceholder}
					options={C.ATTACHMENTS}
					onChange={e => onChange({ attachment: e.value })}
				/>
			)}
			<Select
				id="concept"
				label={D.conceptTitle}
				value={concepts.find(c => c.value === concept)}
				placeholder={D.conceptPlaceholder}
				options={concepts}
				onChange={e => onChange({ concept: e.value })}
			/>
			<Radio
				id="isCoded"
				label={D.isCodedTitle}
				answers={[
					{ value: isCoded, label: D.yes },
					{ value: !isCoded, label: D.no },
				]}
				onChange={() => {
					onChange({ isCoded: !isCoded, codeList: '', range: '' });
				}}
			/>
			{isCoded && (
				<Select
					id="codeList"
					label={D.responseTitle}
					value={codeList.find(t => t.value === component.codeList)}
					placeholder={D.codeListPlaceholder}
					options={codeList}
					onChange={e =>
						onChange({
							codeList: e.value,
							range: codeList.find(c => c.value === e.value).range,
						})
					}
				/>
			)}
			{!isCoded && (
				<Select
					id="range"
					label={D.rangeTitle}
					value={C.XSD_TYPES.find(t => t.value === range)}
					placeholder={D.rangePlaceholder}
					options={C.XSD_TYPES}
					onChange={e => onChange({ range: e.value })}
				/>
			)}
			<Controls
				deleteAction={() => deleteComponent(id)}
				saveAction={() => addComponent(component)}
				disabledSave={!id || !labelLg1 || !type}
			/>
		</>
	);
};

export default ComponentDetail;
