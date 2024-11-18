import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Loading } from '@components/loading';
import { CodeListApi } from '../../../sdk';
import { API } from '../../apis';
import { formatPartialCodeList } from '../../utils';
import { DumbCodelistPartialDetailEdit } from './edit';
import { useStampsOptions } from '../../../utils/hooks/stamps';

const useBackOrReplaceHook = () => {
	const navigate = useNavigate();
	const location = useLocation();
	return useCallback(
		(defaultRoute, forceRedirect) => {
			if (forceRedirect) {
				if (history.length === 1 || location.state) {
					navigate(defaultRoute);
				} else {
					navigate(-1);
				}
			} else {
				navigate(defaultRoute, { replace: true });
			}
		},
		[navigate, location],
	);
};

export const Component = (props) => {
	const { id } = useParams();
	const goBackOrReplace = useBackOrReplaceHook();
	const [loadingList, setLoadingList] = useState(true);
	const [loadingLists, setLoadingLists] = useState(true);
	const [saving, setSaving] = useState(false);
	const [codelist, setCodelist] = useState({});
	const [globalCodeListOptions, setGlobalCodeListOptions] = useState([]);
	const [serverSideError, setServerSideError] = useState('');

	const stampListOptions = useStampsOptions();

	const handleBack = useCallback(() => {
		goBackOrReplace('/codelists/partial', true);
	}, [goBackOrReplace]);

	const handleSave = useCallback(
		(codelist, parentCodes) => {
			setSaving(true);
			setServerSideError('');
			const payload = {
				...codelist,
				codes: parentCodes
					.filter((code) => code.isPartial)
					.reduce((acc, c) => {
						return {
							...acc,
							[c.code]: {
								...c,
							},
						};
					}, {}),
			};
			const request = id ? API.putCodelistPartial : API.postCodelistPartial;
			request(payload)
				.then(() => {
					goBackOrReplace(`${codelist.id}`, !!id);
				})
				.catch((error) => {
					setCodelist(codelist);
					setServerSideError(error);
				})
				.finally(() => setSaving(false));
		},
		[goBackOrReplace, id],
	);

	useEffect(() => {
		API.getCodelists()
			.then((codelists) => {
				setGlobalCodeListOptions(
					Object.values(codelists).map((cl) => {
						return {
							value: cl.id,
							label: cl.labelLg1,
							iriParent: cl.uri,
						};
					}),
				);
			})
			.finally(() => setLoadingLists(false));
	}, []);

	useEffect(() => {
		if (id && globalCodeListOptions && globalCodeListOptions[0]) {
			API.getCodelistPartial(id)
				.then((cl) => {
					const idParent = globalCodeListOptions.find(
						(parent) => parent.iriParent === cl.iriParent,
					).value;
					return CodeListApi.getCodesListCodes(idParent, 1, 0).then((codes) => {
						setCodelist(formatPartialCodeList(cl, codes.items));
					});
				})
				.finally(() => setLoadingList(false));
		} else {
			setCodelist({});
			setLoadingList(false);
		}
	}, [id, globalCodeListOptions]);

	if (loadingList || loadingLists) {
		return <Loading />;
	}
	if (saving) {
		return <Loading text="saving" />;
	}

	return (
		<DumbCodelistPartialDetailEdit
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
