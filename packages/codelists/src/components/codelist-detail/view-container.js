import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Loading, goBack } from '@inseefr/wilco';
import { Stores } from 'bauhaus-utilities';
import { API } from '../../apis';
import ComponentTitle from './title';
import { CodeListDetailView } from './view';

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
			.then((cl) => {
				console.log(cl);
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
				console.log(cl);
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
				handleUpdate={`/codelists/${codelist.id}/modify`}
				secondLang={secondLang}
				mutualized={true}
				updatable={true}
			/>
		</React.Fragment>
	);
};

export default CodelistComponentView;
