import React, { useState, useEffect, useCallback } from 'react';
import { Loading, goBack } from '@inseefr/wilco';
import { ComponentDetailView } from './view';
import { CodesList, Stores } from 'bauhaus-utilities';
import ComponentTitle from './title';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const CodelistComponentView = (props) => {
	const secondLang = useSelector(Stores.SecondLang.getSecondLang);
	const { notation } = useParams();
	const [loading, setLoading] = useState(true);
	const [component, setComponent] = useState({});

	const handleBack = useCallback(() => {
		goBack(props, '/codelists')();
	}, [props]);

	useEffect(() => {
		CodesList.getCodesList(notation)
			.then((codelist) => {
				setComponent(codelist);
			})
			.finally(() => setLoading(false));
	}, [notation]);

	if (loading) {
		return <Loading />;
	}

	return (
		<React.Fragment>
			<ComponentTitle component={component} secondLang={secondLang} />
			<ComponentDetailView
				{...props}
				col={2}
				component={component}
				handleBack={handleBack}
				handleUpdate={`/structures/components/${component.notation}/modify`}
				mutualized={true}
				updatable={true}
			/>
		</React.Fragment>
	);
};

export default CodelistComponentView;
