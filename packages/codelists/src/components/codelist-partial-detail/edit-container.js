import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loading } from '@inseefr/wilco';
import { Stores } from 'bauhaus-utilities';
import { API } from '../../apis';
import { formatPartialCodeList, recalculatePositions } from '../../utils';
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
	const [loadingList, setLoadingList] = useState(true);
	const [loadingLists, setLoadingLists] = useState(true);
	const [saving, setSaving] = useState(false);
	const [codelist, setCodelist] = useState({});
	const [globalCodeListOptions, setGlobalCodeListOptions] = useState({});
	const [serverSideError, setServerSideError] = useState('');
	const stampListOptions = useSelector((state) =>
		Stores.Stamps.getStampListOptions(state)
	);

	const handleBack = useCallback(() => {
		goBackOrReplace('/codelists-partial', true);
	}, [goBackOrReplace]);

	const codeWithoutIsPartial = (code) => {
		const { isPartial, ...restOfCode } = code;
		return restOfCode;
	};

	const handleSave = useCallback(
		(codelist, parentCodes) => {
			setSaving(true);
			setServerSideError('');
			const payload = {
				...codelist,
				codes: parentCodes
					.filter((code) => code.isPartial)
					.map((code) => codeWithoutIsPartial(code)),
			};
			console.log('payload', payload);
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
		[goBackOrReplace, id]
	);

	useEffect(() => {
		API.getCodelists()
			.then((codelists) => {
				setGlobalCodeListOptions(
					Object.values(codelists).map((cl) => {
						return {
							value: cl.id,
							label: cl.labelLg1,
						};
					})
				);
			})
			.finally(() => setLoadingLists(false));
	}, []);

	useEffect(() => {
		if (id) {
			API.getCodelistPartial(id)
				.then((cl) => {
					const splitParent = cl.iriParent.split('/');
					const idParent = splitParent[splitParent.length - 1];
					API.getDetailedCodelist(idParent).then((parentCl) => {
						setCodelist(formatPartialCodeList(cl, parentCl));
					});
				})
				.finally(() => setLoadingList(false));
		} else {
			setCodelist({});
			setLoadingList(false);
		}
	}, [id]);

	if (loadingList || loadingLists) {
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
			globalCodeListOptions={globalCodeListOptions}
			serverSideError={serverSideError}
		/>
	);
};

export default CodelistPartialEdit;
