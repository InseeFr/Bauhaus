import D from '../../../../i18n';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button, ActionToolbar, ReturnButton } from '@inseefr/wilco';
import {
	Loading,
	ErrorBloc,
	ValidationButton,
	PageTitleBlock,
} from '../../../../new-architecture/components';

import { useGoBack } from '../../../../new-architecture/utils/hooks/useGoBack';
import api from '../../../../remote-api/operations-api';

import { useCallback, useEffect, useState } from 'react';
import OperationsFamilyVisualization from '../../../../applications/operations/families/visualization/visualization';
import { Auth, Stores, CheckSecondLang } from '../../../../utils';
import { containUnsupportedStyles } from '../../../../new-architecture/utils/html-utils';
import { getLocales } from '../../../../new-architecture/redux/selectors';
const Family = () => {
	const { id } = useParams();
	const langs = useSelector((state) => getLocales(state));
	const secondLang = useSelector((state) =>
		Stores.SecondLang.getSecondLang(state)
	);
	const goBack = useGoBack();

	const [family, setFamily] = useState({});
	const [serverSideError, setServerSideError] = useState();
	const [publishing, setPublishing] = useState(false);

	useEffect(() => {
		api.getFamilyById(id).then(setFamily);
	}, [id]);

	const publish = useCallback(() => {
		setPublishing(true);

		api
			.publishFamily(family)
			.then(() => {
				return api.getFamilyById(id).then(setFamily);
			})
			.catch((error) => setServerSideError(error))
			.finally(() => setPublishing(false));
	}, [family, id]);

	if (!family.id) return <Loading />;
	if (publishing) return <Loading text={'publishing'} />;

	/*
	 * The publication button should be enabled only if RICH_TEXT value do not
	 * have unsupported styles like STRIKETHROUGH, color or background color
	 */
	const publicationDisabled = containUnsupportedStyles(family);
	return (
		<div className="container">
			<PageTitleBlock
				titleLg1={family.prefLabelLg1}
				titleLg2={family.prefLabelLg2}
				secondLang={secondLang}
			/>
			<ActionToolbar>
				<ReturnButton action={() => goBack('/operations/families')} />

				<Auth.AuthGuard roles={[Auth.ADMIN]}>
					<ValidationButton
						object={family}
						callback={publish}
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
			{serverSideError && <ErrorBloc error={serverSideError} D={D} />}
			`
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
