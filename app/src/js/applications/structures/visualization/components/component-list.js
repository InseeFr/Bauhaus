import React, { useState } from 'react';
import { Checkbox } from 'react-bootstrap';
import { filterDeburr, Input, Pagination } from '@inseefr/wilco';

import Badge from 'js/applications/shared/badge';
import D from 'js/i18n';
import { StructuresConstants } from 'bauhaus-structures';
import { ArrayUtils } from 'bauhaus-utilities';

const ComponentList = ({ components, checked, onCheck, onChange }) => {
	const [search, setSearch] = useState(() => '');

	const items = buildComponents(
		checked,
		ArrayUtils.sortArrayByLabel(components),
		onChange,
		search
	);

	return (
		<>
			<div className="row">
				<div className="col-md-4 text-center">
					<Checkbox
						defaultChecked={checked[StructuresConstants.ATTRIBUTE_TYPE]}
						onChange={() => onCheck(StructuresConstants.ATTRIBUTE_TYPE)}
					>
						{D.attributsTitle}
					</Checkbox>
				</div>
				<div className="col-md-4 text-center">
					<Checkbox
						defaultChecked={checked[StructuresConstants.DIMENSION_TYPE]}
						onChange={() => onCheck(StructuresConstants.DIMENSION_TYPE)}
					>
						{D.dimensionsTitle}
					</Checkbox>
				</div>
				<div className="col-md-4 text-center">
					<Checkbox
						defaultChecked={checked[StructuresConstants.MEASURE_TYPE]}
						onChange={() => onCheck(StructuresConstants.MEASURE_TYPE)}
					>
						{D.measuresTitle}
					</Checkbox>
				</div>
			</div>
			<div className="row">
				<div className="col-md-10 col-md-offset-1 text-center">
					<Input
						value={search}
						onChange={e => setSearch(e.target.value)}
						placeholder={D.searchLabelPlaceholder}
					/>
					<Pagination itemEls={items} itemsPerPage="10" />
				</div>
			</div>
		</>
	);
};

export default ComponentList;

const buildComponents = (checked, components, onChange, search) =>
	components.reduce((_, component, i) => {
		const { id, label, type } = component;
		if (checked[type] && filterDeburr(search)(label)) {
			_.push(
				<div className="row" key={`${type}-${i}`}>
					<button
						onClick={() => onChange(id, type)}
						className="btn-no-btn list-group-item"
					>
						<span>{label}</span> <Badge type={type} />
					</button>
				</div>
			);
		}
		return _;
	}, []);
