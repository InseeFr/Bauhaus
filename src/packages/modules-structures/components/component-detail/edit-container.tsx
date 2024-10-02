import { useState, useEffect, useCallback } from 'react';
import { Loading } from '../../../components';
import { useGoBack } from '../../../utils/hooks/useGoBack';
import { DumbComponentDetailEdit } from './edit';
import { getFormattedCodeList } from '../../apis';
import { ConceptsApi, saveComponent, StructureApi } from '../../../sdk';
import { useParams } from 'react-router-dom';
import { useStampsOptions } from '../../../utils/hooks/stamps';
import { Component as StructureComponent } from '../../../model/structures/Component';
import { CodesLists } from '../../../model/CodesList';

export const Component = (props: any) => {
	const goBack = useGoBack();

	const { id } = useParams<{ id: string }>();
	const urlParams = new URLSearchParams(window.location.search);
	const type = urlParams.get('type');
	const [loading, setLoading] = useState<boolean>(true);
	const [saving, setSaving] = useState<boolean>(false);
	const [component, setComponent] = useState({});
	const [concepts, setConcepts] = useState([]);
	const [codesLists, setCodesLists] = useState<CodesLists>([]);
	const [serverSideError, setServerSideError] = useState<string>('');
	const [attributes, setAttributes] = useState([]);

	const stampListOptions = useStampsOptions();

	const handleBack = useCallback(
		() => goBack('/structures/components'),
		[goBack],
	);

	const handleSave = useCallback(
		(component: StructureComponent) => {
			setSaving(true);
			setServerSideError('');

			saveComponent(component)
				.then((id = component.id) =>
					goBack(`/structures/components/${id}`, !component.id),
				)
				.catch((error: string) => {
					setComponent(component);
					setServerSideError(error);
				})
				.finally(() => setSaving(false));
		},
		[goBack],
	);

	useEffect(() => {
		const getComponent = id
			? StructureApi.getMutualizedComponent(id)
			: Promise.resolve({});
		Promise.all([
			getComponent,
			StructureApi.getMutualizedAttributes(),
			ConceptsApi.getConceptList(),
			getFormattedCodeList(),
		])
			.then(([component, attributes, concepts, codesLists]) => {
				setComponent(component);
				setAttributes(attributes);
				setConcepts(concepts);
				setCodesLists(codesLists);
			})
			.finally(() => setLoading(false));
	}, [id]);

	if (loading) {
		return <Loading />;
	}
	if (saving) {
		return <Loading text="saving" />;
	}

	return (
		<DumbComponentDetailEdit
			{...props}
			col={2}
			codesLists={codesLists}
			component={component}
			concepts={concepts}
			handleBack={handleBack}
			handleSave={handleSave}
			mutualized={true}
			stampListOptions={stampListOptions}
			attributes={attributes}
			serverSideError={serverSideError}
			type={type === 'ALL' ? undefined : type}
		/>
	);
};
