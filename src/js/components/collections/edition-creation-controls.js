import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import { dictionary } from 'js/utils/dictionary';
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
	if (!id || !prefLabelLg1 || !creator)
		message = dictionary.warning.missing.collection;

	if (
		prefLabelLg1 !== initialPrefLabelLg1 &&
		arrayKeepUniqueField(collectionList, 'label').indexOf(
			deburr(prefLabelLg1.toLowerCase())
		) !== -1
	)
		message = dictionary.warning.duplicated.label;
	if (
		id !== initialId &&
		arrayKeepUniqueField(collectionList, 'id').indexOf(
			deburr(id.toLowerCase())
		) !== -1
	)
		message = dictionary.warning.duplicated.id;

	return (
		<div className="row btn-line">
			<div className="col-md-2">
				<Link
					to={redirectCancel()}
					className="btn btn-primary btn-lg col-md-12"
				>
					<span
						className="glyphicon glyphicon-floppy-remove"
						aria-hidden="true"
					/>{' '}
					{dictionary.buttons.cancel}
				</Link>
			</div>
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
			<div className="col-md-2 pull-right">
				<button
					type="button"
					className="btn btn-primary btn-lg col-md-12"
					disabled={message}
					onClick={handleSave}
				>
					<span
						className="glyphicon glyphicon-floppy-disk"
						aria-hidden="true"
					/>{' '}
					{dictionary.buttons.save}
				</button>
			</div>
		</div>
	);
}

CollectionEditionCreationControls.propTypes = {
	general: generalPropTypes.isRequired,
	handleSave: PropTypes.func.isRequired,
	redirectCancel: PropTypes.func.isRequired,
};

export default CollectionEditionCreationControls;
