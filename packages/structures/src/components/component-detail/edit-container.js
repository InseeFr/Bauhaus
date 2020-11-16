import React, { useState, useEffect, useCallback } from 'react';
import { Loading, goBack, goBackOrReplace } from '@inseefr/wilco';
import { ComponentDetailEdit } from './edit';
import api from '../../apis/structure-api';
import { getFormattedCodeList } from '../../apis/code-list';
import { ConceptsAPI, Stores } from 'bauhaus-utilities';
import { useParams } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';

const ViewContainer = props => {
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [component, setComponent] = useState({});
	const [concepts, setConcepts] = useState([]);
	const [codesLists, setCodesLists] = useState([]);

	const stampListOptions = useSelector(state => Stores.Stamps.getStampListOptions(state));
	const disseminationStatusListOptions = useSelector(state => Stores.DisseminationStatus.getDisseminationStatusListOptions(state));
	useEffect(() => {
		if(disseminationStatusListOptions.length === 0){
			props.loadDisseminationStatusList();
		}
	}, [disseminationStatusListOptions.length, props.loadDisseminationStatusList]);

	const handleBack = useCallback(() => {
		goBack(props, '/structures/components')();
	}, [props]);

	const handleSave = useCallback(
		(component) => {
			setSaving(true);
			let request;

			if (component.id) {
				request = api.putMutualizedComponent(component);
			} else {
				request = api.postMutualizedComponent(component);
			}

			request.then((id = component.id) => {
				setSaving(false);
				return goBackOrReplace(
					props,
					`/structures/components/${id}`,
					!component.id
				);
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
			disseminationStatusListOptions={disseminationStatusListOptions}
			stampListOptions={stampListOptions}
		/>
	);
};

export default connect(undefined, {
	loadDisseminationStatusList: Stores.DisseminationStatus.loadDisseminationStatusList
})(ViewContainer);
