import { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Loading } from '../../../../new-architecture/components/loading/loading';
import { API } from '../../apis';
import { formatCodeList, recalculatePositions } from '../../utils';
import { TreeContext } from '../tree/treeContext';
import { DumbCodelistDetailEdit } from './edit';
import { useStampsOptions } from '../../../../new-architecture/utils/hooks/stamps';

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
					goBackOrReplace(`${codelist.id}`, !!id);
				})
				.catch((error) => {
					setCodelist(codelist);
					setServerSideError(error);
				})
				.finally(() => setSaving(false));
		},
		[tree, goBackOrReplace, id]
	);

	useEffect(() => {
		if (!!id) {
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
