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
	const [codelists, setCodelists] = useState([]);
	const [codelist, setCodelist] = useState({});

	const handleBack = useCallback(() => {
		goBack(props, '/codelists')();
	}, [props]);

	useEffect(() => {
		API.getCodelists().then((codelists) => {
			setCodelists(Object.values(codelists));
		});
	}, []);

	useEffect(() => {
		if (codelists && codelists[0]) {
			API.getCodelistPartial(id)
				.then((cl) => {
					const idParent = codelists.find(
						(codelist) => codelist.uri === cl.iriParent
					).id;
					API.getDetailedCodelist(idParent).then((parentCl) => {
						setCodelist(formatPartialCodeList(cl, parentCl));
					});
				})
				.finally(() => setLoading(false));
		}
	}, [id, codelists]);

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
