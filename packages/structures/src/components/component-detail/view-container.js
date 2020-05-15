import React, { useState, useEffect, useCallback } from 'react';
import { Loading, goBack } from '@inseefr/wilco';
import { ComponentDetailView } from './view';
import api from '../../apis/structure-api';
import { getFormattedCodeList } from '../../apis/code-list';
import { ConceptsAPI, Stores } from 'bauhaus-utilities';
import ComponentTitle from './title';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const ViewContainer = props => {
	const secondLang = useSelector(Stores.SecondLang.getSecondLang);
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [component, setComponent] = useState({});
	const [concepts, setConcepts] = useState([]);
	const [codesLists, setCodesLists] = useState([]);

	const handleBack = useCallback(() => {
		goBack(props, '/structures/components')();
	}, [props]);

	useEffect(() => {
		Promise.all([
			api.getMutualizedComponent(id),
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
		<React.Fragment>
			<ComponentTitle component={component} secondLang={secondLang} />

			<ComponentDetailView
				{...props}
				col={2}
				codesLists={codesLists}
				component={component}
				concepts={concepts}
				handleBack={handleBack}
				handleUpdate={`/structures/components/${component.id}/modify`}
				mutualized={true}
				updatable={true}
			/>
		</React.Fragment>
	);
};

export default ViewContainer;
