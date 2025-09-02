import { useState, useEffect, useCallback } from 'react';

import { ConceptsApi } from '@sdk/index';

import { CodesList, CodesLists } from '../../../model/CodesList';
import { Component } from '../../../model/structures/Component';
import { getFormattedCodeList } from '../../apis';
import { CodesListPanel } from '../../components/codes-list-panel/codes-list-panel';
import ComponentSpecificationModal from '../../components/component-specification-modal/index';
import { StructureComponentsSelector } from '../../components/structure-component-selector';
import { EMPTY_ARRAY } from '@utils/array-utils';

export const ComponentsPanel = ({ componentDefinitions = EMPTY_ARRAY }) => {
	const [concepts, setConcepts] = useState([]);
	const [codesLists, setCodesLists] = useState<CodesLists>([]);
	const [modalOpened, setModalOpened] = useState(false);
	const [selectedComponent, setSelectedComponent] = useState<Component>();

	const [codesList, setCodesList] = useState<CodesList | undefined>(undefined);
	const handleCodesListDetail = useCallback((codesList: CodesList) => {
		setCodesList(codesList);
	}, []);

	useEffect(() => {
		ConceptsApi.getConceptList().then(setConcepts);
	}, []);

	useEffect(() => {
		getFormattedCodeList().then((lists) => setCodesLists(lists));
	}, []);

	const handleSpecificationClick = useCallback((component: Component) => {
		setSelectedComponent(component);
		setModalOpened(true);
	}, []);

	return (
		<div className="row text-left">
			{modalOpened && selectedComponent && (
				<ComponentSpecificationModal
					onClose={() => setModalOpened(false)}
					selectedComponent={selectedComponent}
					structureComponents={componentDefinitions}
					disabled={true}
					specification={{
						attachment: selectedComponent.attachment,
						required: selectedComponent.required,
						notation: selectedComponent.notation,
						labelLg1: selectedComponent.labelLg1,
						labelLg2: selectedComponent.labelLg2,
					}}
				/>
			)}
			<StructureComponentsSelector
				componentDefinitions={componentDefinitions}
				handleSpecificationClick={handleSpecificationClick}
				concepts={concepts}
				codesLists={codesLists}
				readOnly={true}
				handleCodesListDetail={handleCodesListDetail}
			/>
			<CodesListPanel
				codesList={codesList}
				isOpen={!!codesList}
				handleBack={() => setCodesList(undefined)}
			/>
		</div>
	);
};
