import React from 'react';
import {
	CancelButton,
	ErrorBloc,
	ActionToolbar,
	SaveButton,
} from '@inseefr/ui';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import D from 'js/i18n';
import { arrayKeepUniqueField } from 'js/utils/array-utils';
import { propTypes as generalPropTypes } from 'js/utils/collections/general';

function CollectionEditionCreationControls({
	general,
	creation,
	collectionList,
	initialId,
	initialPrefLabelLg1,
	handleSave,
	redirectCancel,
}) {
	const { id, prefLabelLg1, creator } = general;

	let message;
	if (!id || !prefLabelLg1 || !creator) message = D.incompleteCollection;

	if (
		prefLabelLg1 !== initialPrefLabelLg1 &&
		arrayKeepUniqueField(collectionList, 'label').indexOf(
			deburr(prefLabelLg1.toLowerCase())
		) !== -1
	)
		message = D.duplicatedLabel;
	if (
		id !== initialId &&
		arrayKeepUniqueField(collectionList, 'id').indexOf(
			deburr(id.toLowerCase())
		) !== -1
	)
		message = D.duplicatedId;

	return (
		<>
			<ActionToolbar>
				<CancelButton action={redirectCancel()} />
				<SaveButton action={handleSave} disabled={message} />
			</ActionToolbar>
			<ErrorBloc error={message} />
		</>
	);
}

CollectionEditionCreationControls.propTypes = {
	general: generalPropTypes.isRequired,
	handleSave: PropTypes.func.isRequired,
	redirectCancel: PropTypes.func.isRequired,
};

export default CollectionEditionCreationControls;
