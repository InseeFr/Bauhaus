import React, { useState, useEffect, useCallback } from 'react';
import { Loading, goBack, goBackOrReplace } from '@inseefr/wilco';
import { ComponentDetailEdit } from './edit';
import api from '../../apis/structure-api';
import { getFormattedCodeList } from '../../apis/code-list';
import { ConceptsAPI, Stores } from 'js/utils';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const EditContainer = (props) => {
	const { id } = useParams();
	const urlParams = new URLSearchParams(window.location.search);
	const type = urlParams.get('type');
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [component, setComponent] = useState({});
	const [concepts, setConcepts] = useState([]);
	const [codesLists, setCodesLists] = useState([]);
	const [serverSideError, setServerSideError] = useState('');
	const [attributes, setAttributes] = useState([]);

	const stampListOptions = useSelector((state) =>
		Stores.Stamps.getStampListOptions(state)
	);

	const handleBack = useCallback(() => {
		goBack(props, '/structures/components')();
	}, [props]);

	const handleSave = useCallback(
		(component) => {
			setSaving(true);
			setServerSideError('');

			let request;

			if (component.id) {
				request = api.putMutualizedComponent(component);
			} else {
				request = api.postMutualizedComponent(component);
			}

			request
				.then((id = component.id) => {
					return goBackOrReplace(
						props,
						`/structures/components/${id}`,
						!component.id
					);
				})
				.catch((error) => {
					setComponent(component);
					setServerSideError(error);
				})
				.finally(() => setSaving(false));
		},
		[props]
	);

	useEffect(() => {
		const getComponent = id
			? api.getMutualizedComponent(id)
			: Promise.resolve({});
		Promise.all([
			getComponent,
			api.getMutualizedAttributes(),
			ConceptsAPI.getConceptList(),
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
		<ComponentDetailEdit
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

export default EditContainer;
