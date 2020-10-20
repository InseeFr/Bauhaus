import React, { useState, useEffect, useCallback } from 'react';
import { Loading, goBack, goBackOrReplace } from '@inseefr/wilco';
import { ComponentDetailEdit } from './edit';
import api from '../../apis/structure-api';
import { getFormattedCodeList } from '../../apis/code-list';
import { ConceptsAPI } from 'bauhaus-utilities';
import { useParams } from 'react-router-dom';

const ViewContainer = (props) => {
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [component, setComponent] = useState({});
	const [concepts, setConcepts] = useState([]);
	const [codesLists, setCodesLists] = useState([]);

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
			? //? api.getMutualizedComponent(id)
			  Promise.resolve([
					{
						labelLg1: 'Actif',
						concept: '',
						id: 'd1004',
						codeList: 'http://bauhaus/codes/cl004',
						type: 'http://purl.org/linked-data/cube#DimensionProperty',
					},
					{
						labelLg1: "Branche d'activité",
						concept: 'c1560',
						id: 'd1005',
						codeList: 'http://id.insee.fr/codes/nafr2/naf',
						type: 'http://purl.org/linked-data/cube#DimensionProperty',
					},
					{
						labelLg1: 'Dépenses de consommation finale',
						concept: '',
						id: 'm1002',
						type: 'http://purl.org/linked-data/cube#MeasureProperty',
					},
					{
						labelLg1: 'Formation brute de capital fixe',
						concept: 'c1371',
						id: 'm1003',
						type: 'http://purl.org/linked-data/cube#MeasureProperty',
					},
					{
						labelLg1: 'Frequence',
						concept: '',
						id: 'a1021',
						type: 'http://purl.org/linked-data/cube#AttributeProperty',
					},
					{
						labelLg1: 'Prix de référence',
						concept: 'c1086',
						id: 'd1002',
						codeList: 'http://bauhaus/codes/cl002',
						type: 'http://purl.org/linked-data/cube#DimensionProperty',
					},
					{
						labelLg1: 'Produit intérieur brut',
						concept: 'c1365',
						id: 'm1001',
						type: 'http://purl.org/linked-data/cube#MeasureProperty',
					},
					{
						labelLg1: 'Produit intérieur brut',
						concept: '',
						id: 'm1004',
						type: 'http://purl.org/linked-data/cube#MeasureProperty',
					},
					{
						labelLg1: 'Produit intérieur brut',
						concept: 'c1950',
						id: 'm1005',
						type: 'http://purl.org/linked-data/cube#MeasureProperty',
					},
					{
						labelLg1: 'Période de référence',
						concept: '',
						id: 'd1003',
						type: 'http://purl.org/linked-data/cube#DimensionProperty',
					},
					{
						labelLg1: 'Secteur institutionnel',
						concept: 'c1875',
						id: 'd1001',
						codeList: 'http://bauhaus/codes/cl001',
						type: 'http://purl.org/linked-data/cube#DimensionProperty',
					},
					{
						labelLg1: 'Statistical unit',
						concept: 'c1528',
						id: 'a1005',
						type: 'http://purl.org/linked-data/cube#AttributeProperty',
					},
					{
						labelLg1: "Statut de l'observation",
						concept: '',
						id: 'a1022',
						codeList: 'http://bauhaus/codes/cl003',
						type: 'http://purl.org/linked-data/cube#AttributeProperty',
					},
					{
						labelLg1: 'deuxième composant crée',
						concept: '',
						id: 'd1006',
						type: 'http://purl.org/linked-data/cube#DimensionProperty',
					},
					{
						labelLg1: 're',
						concept: 'c1790',
						id: 'm1006',
						type: 'http://purl.org/linked-data/cube#MeasureProperty',
					},
					{
						labelLg1: 'rh',
						concept: 'null',
						id: 'a1024',
						type: 'http://purl.org/linked-data/cube#AttributeProperty',
					},
					{
						labelLg1: 't1',
						concept: 'null',
						id: 'a1023',
						type: 'http://purl.org/linked-data/cube#AttributeProperty',
					},
					{
						labelLg1: 'te',
						concept: 'null',
						id: 'd1007',
						type: 'http://purl.org/linked-data/cube#DimensionProperty',
					},
			  ])
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
		/>
	);
};

export default ViewContainer;
