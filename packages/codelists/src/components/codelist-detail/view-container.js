import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Loading, goBack } from '@inseefr/wilco';
import { Stores } from 'bauhaus-utilities';
import { API } from '../../apis';
import ComponentTitle from './title';
import { CodeListDetailView } from './view';

const CodelistComponentView = (props) => {
	const secondLang = useSelector(Stores.SecondLang.getSecondLang);
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [codelist, setCodelist] = useState({});

	const handleBack = useCallback(() => {
		goBack(props, '/codelists')();
	}, [props]);

	useEffect(() => {
		API.getDetailedCodelist(id)
			.then((codelist) => {
				setCodelist(codelist);
			})
			.finally(() => setLoading(false));
	}, [id]);

	if (loading) {
		return <Loading />;
	}

	return (
		<React.Fragment>
			<ComponentTitle component={codelist} secondLang={secondLang} />
			<CodeListDetailView
				{...props}
				col={2}
				codelist={codelist}
				handleBack={handleBack}
				handleUpdate={`/codelists/components/${codelist.id}/modify`}
				secondLang={secondLang}
				mutualized={true}
				updatable={true}
			/>
		</React.Fragment>
	);
};

export default CodelistComponentView;
