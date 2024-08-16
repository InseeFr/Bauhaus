import { useState, useEffect, useCallback } from 'react';

import { CodesListPanel } from '../../components/codes-list-panel/codes-list-panel';
import { StructureComponentsSelector } from '../../components/structure-component-selector/index';
import ComponentSpecificationModal from '../../components/component-specification-modal/index';
import { getFormattedCodeList } from '../../apis/code-list';
import { ConceptsApi } from '../../..//sdk';

const Components = ({ componentDefinitions = [] }) => {
	const [concepts, setConcepts] = useState([]);
	const [codesLists, setCodesLists] = useState([]);
	const [modalOpened, setModalOpened] = useState(false);
	const [selectedComponent, setSelectedComponent] = useState({});

	const [codesListNotation, setCodesListNotation] = useState(undefined);
	const handleCodesListDetail = useCallback((notation) => {
		setCodesListNotation(notation);
	}, []);

	useEffect(() => {
		ConceptsApi.getConceptList().then((res) => setConcepts(res));
	}, []);

	useEffect(() => {
		getFormattedCodeList().then((res) => {
			setCodesLists(res);
		});
	}, []);

	const handleSpecificationClick = useCallback((component) => {
		setSelectedComponent(component);
		setModalOpened(true);
	}, []);

	return (
		<div className="row text-left">
			{modalOpened && (
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
				codesList={codesListNotation}
				isOpen={!!codesListNotation}
				handleBack={() => setCodesListNotation(undefined)}
			/>
		</div>
	);
};

export default Components;
