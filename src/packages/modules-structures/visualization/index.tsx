//@ts-nocheck
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { CheckSecondLang } from '@components/check-second-lang';
import { ErrorBloc } from '@components/errors-bloc';
import { Loading } from '@components/loading';
import { PageTitleBlock } from '@components/page-title-block';

import { StructureApi } from '@sdk/index';

import { useTitle } from '@utils/hooks/useTitle';

import MainDictionary from '../../deprecated-locales/build-dictionary';
import { Structure } from '../../model/structures/Structure';
import StructureVisualizationControl from '../components/structure-visualization/controls';
import D from '../i18n/build-dictionary';
import { ComponentsPanel } from './components/components-panel';
import { DescriptionsPanel } from './components/descriptions-panel';
import { GlobalInformationsPanel } from './components/global-informations-panel';
import { EMPTY_ARRAY } from '../../utils/array-utils';

interface StructureViewTypes {
	structure: Structure;
	publish: (id: string) => void;
	serverSideError?: string;
}
export const StructureView = ({
	structure,
	publish,
	serverSideError,
}: StructureViewTypes) => {
	useTitle(D.structuresTitle, structure?.labelLg1);

	const {
		labelLg1,
		labelLg2,
		descriptionLg1,
		descriptionLg2,
		componentDefinitions = EMPTY_ARRAY,
	} = structure;

	return (
		<>
			<PageTitleBlock titleLg1={labelLg1} titleLg2={labelLg2} />
			<CheckSecondLang />
			<StructureVisualizationControl structure={structure} publish={publish} />
			<ErrorBloc error={serverSideError} D={MainDictionary} />
			<GlobalInformationsPanel structure={structure} />
			<DescriptionsPanel
				descriptionLg1={descriptionLg1}
				descriptionLg2={descriptionLg2}
			/>
			<ComponentsPanel componentDefinitions={componentDefinitions} />
		</>
	);
};
export const Component = () => {
	const { structureId } = useParams<{ structureId: string }>();
	const [structure, setStructure] = useState<Structure>({} as Structure);
	const [loading, setLoading] = useState(true);
	const [serverSideError, setServerSideError] = useState<string | undefined>();

	useEffect(() => {
		StructureApi.getStructure(structureId)
			.then((res: Structure) => setStructure(res))
			.finally(() => setLoading(false));
	}, [structureId]);

	const publish = () => {
		setLoading(true);
		setServerSideError(undefined);
		return StructureApi.publishStructure(structure)
			.then(() => StructureAPI.getStructure(structure.id))
			.then((structure: Structure) => setStructure(structure))
			.finally(() => setLoading(false))
			.catch((error: any) => {
				setServerSideError(error);
			});
	};

	if (loading) {
		return <Loading />;
	}

	return (
		<StructureView
			structure={structure}
			publish={publish}
			serverSideError={serverSideError}
		/>
	);
};
