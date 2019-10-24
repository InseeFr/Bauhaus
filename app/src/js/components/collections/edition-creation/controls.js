import React from 'react';
import { Button } from 'bauhaus-library';
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
		<div className="row btn-line">
			<Button
				label={
					<React.Fragment>
						<span
							className="glyphicon glyphicon-floppy-remove"
							aria-hidden="true"
						/>
						<span> {D.btnCancel}</span>
					</React.Fragment>
				}
				action={redirectCancel()}
			/>
			<div className="col-md-8 centered">
				<div
					style={{ visibility: message ? 'visible' : 'hidden' }}
					className="alert alert-danger bold"
					role="alert"
				>
					{/* HACK: if no content, the line height is set to 0 and the rest
	              of the page moves a little  */}
					{message || <span style={{ whiteSpace: 'pre-wrap' }}> </span>}
				</div>
			</div>
			<Button
				label={
					<React.Fragment>
						<span
							className="glyphicon glyphicon-floppy-disk"
							aria-hidden="true"
						/>
						<span> {D.btnSave}</span>
					</React.Fragment>
				}
				action={handleSave}
				disabled={message}
			/>
		</div>
	);
}

CollectionEditionCreationControls.propTypes = {
	general: generalPropTypes.isRequired,
	handleSave: PropTypes.func.isRequired,
	redirectCancel: PropTypes.func.isRequired,
};

export default CollectionEditionCreationControls;
