import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loading, goBack, goBackOrReplace } from '@inseefr/wilco';
import { Stores } from 'bauhaus-utilities';
import { API } from '../../apis';
import D from '../../i18n/build-dictionary';
import { CodeListDetailEdit } from './edit';

const superiorToParent = (child, parent) => {
	return child > parent;
};

const getPosition = (codes, parentName, childPositions) => {
	const parentPositions = codes.map(
		([key, value]) => key === parentName && value.positions
	);
	return {
		parent: parentName,
		position: Math.min(
			...childPositions.filter((childPos) =>
				superiorToParent(childPos, parentPositions[0])
			)
		),
	};
};

const CodelistEdit = (props) => {
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [codelist, setCodelist] = useState({});
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
					return goBackOrReplace(props, `/${id}`, !codelist.id);
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
		API.getDetailedCodelist(id)
			.then((cl) => {
				console.log('codelistBefore', cl);
				if (cl.codes) {
					cl.codes = Object.values(cl.codes)
						.sort((a, b) => (a.code > b.code ? 1 : -1))
						.reduce((acc, c, i) => {
							return {
								...acc,
								[c.code]: {
									...c,
									id: c.code,
									parents:
										c.parents && c.parents[0]
											? c.parents.map((p) =>
													getPosition(
														Object.entries(cl.codes),
														p,
														/* Object.values(Object.values(c.code).positions) */
														c.positions || [i + 1]
													)
											  )
											: [
													{
														parent: '',
														position: c.positions ? c.positions[0] : i + 1,
													},
											  ],
								},
							};
						}, {});
				}
				setCodelist(cl);
				console.log('codelistAfter', cl);
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
