import React, { useState, useEffect, useCallback } from 'react';
import { Loading, goBack, goBackOrReplace } from '@inseefr/wilco';
import { ComponentDetailEdit } from './edit';
import api from '../../apis/structure-api';
import { getFormattedCodeList } from '../../apis/code-list';
import { ConceptsAPI } from 'bauhaus-utilities';
import { useParams } from 'react-router-dom';

const ViewContainer = props => {
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [component, setComponent] = useState({});
	const [concepts, setConcepts] = useState([]);
	const [codesLists, setCodesLists] = useState([]);

	const handleBack = useCallback(() => {
		goBack(props, '/structures/components')();
	}, [props]);

	const handleSave = useCallback(
		component => {
			let request;
			if (component.id) {
				request = api.putMutualizedComponent(component);
			} else {
				request = api.postMutualizedComponent(component);
			}

			request.then((id = component.id) => {
				goBackOrReplace(props, `/structures/components/${id}`, component.id);
			});
		},
		[props]
	);

	useEffect(() => {
		const getComponent = id
			? api.getMutualizedComponent(id)
			: Promise.resolve({});
		Promise.all([
			getComponent,
			ConceptsAPI.getConceptList(),
			getFormattedCodeList(),
		])
			.then(([component, concepts, codesLists]) => {
				setComponent(component);
				setConcepts(concepts);
				setCodesLists(codesLists);
			})
			.finally(() => setLoading(false));
	}, [id]);

	if (loading) {
		return <Loading />;
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
		/>
	);
};

export default ViewContainer;
