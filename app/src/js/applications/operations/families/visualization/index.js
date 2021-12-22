import D from 'js/i18n';
import * as select from 'js/reducers';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
	Button,
	Loading,
	ErrorBloc,
	ActionToolbar,
	goBack,
	ReturnButton,
} from '@inseefr/wilco';
import api from 'js/remote-api/operations-api';

import React, { useCallback, useEffect, useState } from 'react';
import OperationsFamilyVisualization from 'js/applications/operations/families/visualization/visualization';
import {
	Auth,
	Stores,
	HTMLUtils,
	ValidationButton,
	CheckSecondLang,
	PageTitleBlock,
} from 'bauhaus-utilities';

const Family = (props) => {
	const { id } = useParams();
	const langs = useSelector(state => select.getLangs(state))
	const secondLang = useSelector(state => Stores.SecondLang.getSecondLang(state))

	const [family, setFamily] = useState({});
	const [serverSideError, setServerSideError] = useState();

	useEffect(() => {
		api.getFamily(id).then(setFamily);
	}, [id]);

	const publish = useCallback(() => {
		api.publishFamily(family).then(() => {
			return api.getFamily(id).then(setFamily)
		}).catch((error) => setServerSideError(error))
	}, [family, id]);

	if (!family.id) return <Loading />;

	/*
	 * The publication button should be enabled only if RICH_TEXT value do not
	 * have unsupported styles like STRIKETHROUGH, color or background color
	 */
	const publicationDisabled = HTMLUtils.containUnsupportedStyles(family);
	return (
		<div className='container'>
			<PageTitleBlock
				titleLg1={family.prefLabelLg1}
				titleLg2={family.prefLabelLg2}
				secondLang={secondLang}
			/>

			<ActionToolbar>
				<ReturnButton action={goBack(props, '/operations/families')} />

				<Auth.AuthGuard roles={[Auth.ADMIN]}>
					<ValidationButton
						object={family}
						callback={(object) =>
							publish(object, props.publishFamily)
						}
						disabled={publicationDisabled}
					/>
				</Auth.AuthGuard>
				<Auth.AuthGuard roles={[Auth.ADMIN]}>
					<Button
						action={`/operations/family/${family.id}/modify`}
						label={D.btnUpdate}
					/>
				</Auth.AuthGuard>
			</ActionToolbar>

			<ErrorBloc error={serverSideError} />

			<CheckSecondLang />

			<OperationsFamilyVisualization
				secondLang={secondLang}
				attr={family}
				langs={langs}
			/>
		</div>
	);
};
export default Family;
