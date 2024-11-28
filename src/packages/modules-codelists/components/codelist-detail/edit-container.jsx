import { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import { Loading } from '@components/loading';

import { useStampsOptions } from '@utils/hooks/stamps';

import { API } from '../../apis';
import { formatCodeList, recalculatePositions } from '../../utils';
import { TreeContext } from '../tree/treeContext';
import { DumbCodelistDetailEdit } from './edit';

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

const CodelistEdit = (props) => {
	const { id } = useParams();
	const goBackOrReplace = useBackOrReplaceHook();
	const [loading, setLoading] = useState(!!id);
	const [saving, setSaving] = useState(false);
	const [codelist, setCodelist] = useState({});
	const [serverSideError, setServerSideError] = useState('');
	const [tree] = useContext(TreeContext);

	const stampListOptions = useStampsOptions();

	const handleBack = useCallback(() => {
		goBackOrReplace('/codelists', true);
	}, [goBackOrReplace]);

	const handleSave = useCallback(
		(codelist) => {
			const rootNodes = tree;
			const payload = recalculatePositions(codelist, rootNodes);
			setSaving(true);
			setServerSideError('');

			const request = id ? API.putCodelist : API.postCodelist;

			request(payload)
				.then(() => {
					goBackOrReplace(`/codelists/${codelist.id}`, !!id);
				})
				.catch((error) => {
					setCodelist(codelist);
					setServerSideError(error);
				})
				.finally(() => setSaving(false));
		},
		[tree, goBackOrReplace, id],
	);

	useEffect(() => {
		if (id) {
			API.getDetailedCodelist(id)
				.then((cl) => {
					setCodelist(formatCodeList(cl));
				})
				.finally(() => setLoading(false));
		}
	}, [id]);

	if (loading) {
		return <Loading />;
	}
	if (saving) {
		return <Loading text="saving" />;
	}

	return (
		<DumbCodelistDetailEdit
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

export default CodelistEdit;
