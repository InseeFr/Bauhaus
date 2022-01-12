import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Loading, goBack } from '@inseefr/wilco';
import { Stores } from 'bauhaus-utilities';
import { formatPartialCodeList } from '../../utils';
import { API } from '../../apis';
import ComponentTitle from '../codelist-detail/title';
import { CodeListPartialDetailView } from './view';

const CodelistPartialComponentView = (props) => {
	const secondLang = useSelector(Stores.SecondLang.getSecondLang);
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [codelist, setCodelist] = useState({});

	const handleBack = useCallback(() => {
		goBack(props, '/codelists')();
	}, [props]);

	useEffect(() => {
		API.getCodelistPartial(id)
			.then((cl) => {
				const splitParent = cl.iriParent.split('/');
				const idParent = splitParent[splitParent.length - 1];
				API.getDetailedCodelist(idParent).then((parentCl) => {
					setCodelist(formatPartialCodeList(cl, parentCl));
				});
			})
			.finally(() => setLoading(false));
	}, [id]);

	if (loading) {
		return <Loading />;
	}

	return (
		<React.Fragment>
			<ComponentTitle component={codelist} secondLang={secondLang} />
			<CodeListPartialDetailView
				{...props}
				col={2}
				codelist={codelist}
				handleBack={handleBack}
				handleUpdate={`/codelists-partial/${codelist.id}/modify`}
				secondLang={secondLang}
				mutualized={true}
				updatable={true}
			/>
		</React.Fragment>
	);
};

export default CodelistPartialComponentView;
