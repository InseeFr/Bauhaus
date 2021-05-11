import React, { useState, useEffect, useCallback } from 'react';
import { Loading, goBack } from '@inseefr/wilco';
import { ComponentDetailView } from './view';
import { Stores } from 'bauhaus-utilities';
import { API } from '../../apis';
import ComponentTitle from './title';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const CodelistComponentView = (props) => {
	const secondLang = useSelector(Stores.SecondLang.getSecondLang);
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [component, setComponent] = useState({});

	const handleBack = useCallback(() => {
		goBack(props, '/codelists')();
	}, [props]);

	useEffect(() => {
		API.getDetailedCodelist(id)
			.then((codelist) => {
				setComponent(codelist);
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
				component={component}
				handleBack={handleBack}
				handleUpdate={`/codelists/components/${component.id}/modify`}
				secondLang={secondLang}
				mutualized={true}
				updatable={true}
			/>
		</React.Fragment>
	);
};

export default CodelistComponentView;
