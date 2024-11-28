import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Loading } from '@components/loading';

import { ConceptsApi, StructureApi } from '@sdk/index';

import { useSecondLang } from '@utils/hooks/second-lang';
import { useGoBack } from '@utils/hooks/useGoBack';

import { getFormattedCodeList } from '../../apis';
import ComponentTitle from './title';
import { ComponentDetailView } from './view';

export const Component = (props) => {
	const goBack = useGoBack();

	const [secondLang] = useSecondLang();
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [component, setComponent] = useState({});
	const [concepts, setConcepts] = useState([]);
	const [codesLists, setCodesLists] = useState([]);
	const [serverSideError, setServerSideError] = useState();
	const [attributes, setAttributes] = useState([]);

	const handleBack = useCallback(
		() => goBack('/structures/components'),
		[goBack],
	);

	const handleDelete = useCallback(() => {
		setLoading(true);
		StructureApi.deleteMutualizedComponent(id).then(() =>
			goBack('/structures/components'),
		);
	}, [id, goBack]);

	useEffect(() => {
		Promise.all([
			StructureApi.getMutualizedComponent(id),
			StructureApi.getMutualizedAttributes(),
			ConceptsApi.getConceptList(),
			getFormattedCodeList(),
		])
			.then(([component, attributes, concepts, codesLists]) => {
				setComponent({
					...component,
				});
				setAttributes(attributes);
				setConcepts(concepts);
				setCodesLists(codesLists);
			})
			.finally(() => setLoading(false));
	}, [id]);

	if (loading) {
		return <Loading />;
	}

	const publishComponent = () => {
		setLoading(true);
		return StructureApi.publishMutualizedComponent(component)
			.then(() => StructureApi.getMutualizedComponent(component.id))
			.then((component) => setComponent(component))
			.finally(() => setLoading(false))
			.catch(setServerSideError);
	};
	return (
		<>
			<ComponentTitle component={component} secondLang={secondLang} />

			<ComponentDetailView
				{...props}
				col={2}
				codesLists={codesLists}
				component={component}
				concepts={concepts}
				handleBack={handleBack}
				handleDelete={handleDelete}
				handleUpdate={`/structures/components/${component.id}/modify`}
				mutualized={true}
				updatable={true}
				publishComponent={publishComponent}
				serverSideError={serverSideError}
				secondLang={secondLang}
				attributes={attributes}
			/>
		</>
	);
};
