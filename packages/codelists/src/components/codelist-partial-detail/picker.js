import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import D from '../../i18n/build-dictionary';
import {
	Pagination,
	Panel,
	AddLogo,
	DelLogo,
	filterDeburr,
	PickerItem,
} from '@inseefr/wilco';

const Picker = ({ panelTitle, codes, addAction, removeAction }) => {
	const [searchLabel, setSearchLabel] = useState('');

	const getCodesByStatus = () => {
		const check = filterDeburr(searchLabel);
		return codes.reduce(
			(byStatus, { id, label, isPartial }) => {
				if (isPartial) byStatus.selected.push({ id, label });
				else check(label) && byStatus.toSelect.push({ id, label });
				return byStatus;
			},
			{ toSelect: [], selected: [] }
		);
	};
	const { toSelect, selected } = getCodesByStatus();
	const toAddElements = toSelect.map(({ id, label }) => (
		<PickerItem
			key={id}
			id={id}
			label={label}
			logo={AddLogo}
			handleClick={addAction}
		/>
	));
	const addedElements = selected.map(({ id, label }) => (
		<PickerItem
			key={id}
			id={id}
			label={label}
			logo={DelLogo}
			handleClick={removeAction}
		/>
	));

	return (
		<div className="row">
			<div className="col-md-6">
				<Panel title={panelTitle}>{addedElements}</Panel>
			</div>
			<div className="col-md-6 text-center">
				<input
					value={searchLabel}
					onChange={(e) => setSearchLabel(e.target.value)}
					type="text"
					placeholder={D.searchLabelPlaceholder}
					className="form-control"
				/>
				<Pagination itemEls={toAddElements} itemsPerPage="10" />
			</div>
		</div>
	);
};

Picker.propTypes = {
	panelTitle: PropTypes.string.isRequired,
	codes: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		})
	).isRequired,
	addAction: PropTypes.func.isRequired,
	removeAction: PropTypes.func.isRequired,
};
Picker.defaultProps = {};

export default Picker;
