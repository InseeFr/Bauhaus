import React, { useState, useEffect, useCallback } from 'react';
import {
	StructureComponentsSelector,
	getFormattedCodeList,
	ComponentSpecificationModal,
} from 'bauhaus-structures';
import { ConceptsAPI } from 'bauhaus-utilities';

const Components = ({ componentDefinitions = []}) => {
	const [concepts, setConcepts] = useState([]);
	const [codesLists, setCodesLists] = useState([]);
	const [modalOpened, setModalOpened] = useState(false);
	const [selectedComponent, setSelectedComponent] = useState({});

	useEffect(() => {
		ConceptsAPI.getConceptList().then(res => setConcepts(res));
	}, []);

	useEffect(() => {
		getFormattedCodeList().then(res => setCodesLists(res));
	}, []);

	const handleSpecificationClick = useCallback(component => {
		setSelectedComponent(component);
		setModalOpened(true);
	}, []);
	return (
		<div className="row text-left">
			{modalOpened && (
				<ComponentSpecificationModal
					onClose={() => setModalOpened(false)}
					structureComponents={componentDefinitions}
					disabled={true}
					specification={{
						attachment: selectedComponent.attachment,
						required: selectedComponent.required,
					}}
				/>
			)}
			<StructureComponentsSelector
				componentDefinitions={componentDefinitions}
				handleSpecificationClick={handleSpecificationClick}
				concepts={concepts}
				codesLists={codesLists}
				readOnly={true}
			/>
		</div>
	);
};

export default Components;
