import React, { useState, useEffect, useCallback } from 'react';
import { Loading, goBack, goBackOrReplace } from '@inseefr/wilco';
import { CodeListDetailEdit } from './edit';
import { API } from '../../apis';
import { Stores } from 'bauhaus-utilities';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import D from '../../i18n/build-dictionary';

const CodelistEdit = (props) => {
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [codelist, setCodelist] = useState([]);
	const [serverSideError, setServerSideError] = useState('');

	const stampListOptions = useSelector((state) =>
		Stores.Stamps.getStampListOptions(state)
	);

	const handleBack = useCallback(() => {
		goBack(props, '/codelists')();
	}, [props]);

	const handleSave = useCallback(
		(codelist) => {
			setSaving(true);
			setServerSideError('');

			let request;

			if (codelist.id) {
				request = API.putCodelist(codelist);
			} else {
				request = API.postCodelist(codelist);
			}

			request
				.then((id = codelist.id) => {
					return goBackOrReplace(
						props,
						`/structures/components/${id}`,
						!codelist.id
					);
				})
				.catch((error) => {
					setCodelist(codelist);
					setServerSideError(D['errors_' + JSON.parse(error).code]);
				})
				.finally(() => setSaving(false));
		},
		[props]
	);

	useEffect(() => {
		const getCodelist = id ? API.getDetailedCodelist(id) : {};

		getCodelist
			.then((codelist) => {
				setCodelist(codelist);
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
		<CodeListDetailEdit
			{...props}
			col={2}
			codelist={codelist}
			handleBack={handleBack}
			handleSave={handleSave}
			mutualized={true}
			stampListOptions={stampListOptions}
			serverSideError={serverSideError}
		/>
	);
};

export default CodelistEdit;
