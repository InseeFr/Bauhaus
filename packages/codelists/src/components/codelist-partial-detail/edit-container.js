import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loading } from '@inseefr/wilco';
import { Stores } from 'bauhaus-utilities';
import { API } from '../../apis';
import { formatCodeList, recalculatePositions } from '../../utils';
import { TreeContext } from '../tree/treeContext';
import D from '../../i18n/build-dictionary';
import { CodeListPartialDetailEdit } from './edit';

const useBackOrReplaceHook = () => {
	const history = useHistory();
	return useCallback(
		(defaultRoute, forceRedirect) => {
			if (!!forceRedirect) {
				history.length === 1 || history.location.state
					? history.push(defaultRoute)
					: history.goBack();
			} else {
				history.replace(defaultRoute);
			}
		},
		[history]
	);
};

const CodelistPartialEdit = (props) => {
	const { id } = useParams();
	const goBackOrReplace = useBackOrReplaceHook();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [codelist, setCodelist] = useState({});
	const [serverSideError, setServerSideError] = useState('');
	const [tree] = useContext(TreeContext);
	const stampListOptions = useSelector((state) =>
		Stores.Stamps.getStampListOptions(state)
	);

	const handleBack = useCallback(() => {
		goBackOrReplace('/codelists-partial', true);
	}, [goBackOrReplace]);

	const handleSave = useCallback(
		(codelist) => {
			const rootNodes = tree;
			const payload = recalculatePositions(codelist, rootNodes);
			setSaving(true);
			setServerSideError('');

			const request = id ? API.putCodelistPartial : API.postCodelistPartial;

			request(payload)
				.then(() => {
					goBackOrReplace(`${codelist.id}`, !!id);
				})
				.catch((error) => {
					setCodelist(codelist);
					setServerSideError(D['errors_' + JSON.parse(error).code]);
				})
				.finally(() => setSaving(false));
		},
		[tree, goBackOrReplace, id]
	);

	useEffect(() => {
		API.getCodelistPartial(id)
			.then((cl) => {
				setCodelist(formatCodeList(cl));
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
		<CodeListPartialDetailEdit
			{...props}
			col={2}
			codelist={codelist}
			handleBack={handleBack}
			handleSave={handleSave}
			updateMode={id !== undefined}
			stampListOptions={stampListOptions}
			serverSideError={serverSideError}
		/>
	);
};

export default CodelistPartialEdit;
