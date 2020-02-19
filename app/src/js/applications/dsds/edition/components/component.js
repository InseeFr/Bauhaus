import React, { useState, useEffect } from 'react';
import ComponentList from 'js/applications/dsds/visualization/components/component-list';
import ComponentDetail from './details';
import { NewButton } from '@inseefr/wilco';
import { getConcepts, getCodeList } from 'js/remote-api/dsds';
import * as C from 'js/constants';
import D from 'js/i18n';

const Components = ({ components, onChange }) => {
	const [checked, setChecked] = useState({
		[C.ATTRIBUTE_TYPE]: true,
		[C.DIMENSION_TYPE]: true,
		[C.MEASURE_TYPE]: true,
	});
	const [componentId, setComponentId] = useState('');
	const [edition, setEdition] = useState(false);
	const [concepts, setConcepts] = useState([]);
	const [codeList, setCodeList] = useState([]);

	useEffect(() => {
		getConcepts().then(res => {
			setConcepts(res);
		});
		getCodeList().then(res => {
			setCodeList(res);
		});
	}, []);

	const addComponent = component => {
		onChange([...components.filter(c => c.id !== component.id), component]);
		setComponentId('');
		setEdition(false);
	};
	const deleteComponent = id => {
		onChange([...components.filter(c => c.id !== id)]);
		setComponentId('');
		setEdition(false);
	};

	return (
		<div className="components">
			<div className="row centered">
				<h2>{D.componentTitle}</h2>
			</div>
			<div className="row">
				<div className="col-md-6">
					<ComponentList
						checked={checked}
						onCheck={field =>
							setChecked({ ...checked, [field]: !checked[field] })
						}
						components={components.map(({ id, label, labelLg1, type }) => ({
							id,
							type,
							label: label || labelLg1,
						}))}
						onChange={id => {
							setComponentId(id);
							setEdition(true);
						}}
					/>
				</div>
				<div className="col-md-6">
					{edition && (
						<ComponentDetail
							component={components.find(c => c.id === componentId)}
							addComponent={addComponent}
							deleteComponent={deleteComponent}
							concepts={concepts}
							codeList={codeList}
						/>
					)}
					{!edition && (
						<NewButton action={() => setEdition(true)} col={4} offset={4} />
					)}
				</div>
			</div>
		</div>
	);
};

export default Components;
