import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import ComponentList from './component-list';
import ComponentDetail from './component-detail';
import * as C from 'js/constants';
import D from 'js/i18n';
import { StructureAPI } from 'bauhaus-structures';
import { buildExtract } from '@inseefr/wilco';
import './components.scss';

const Components = props => {
	const [checked, setChecked] = useState({
		[C.ATTRIBUTE_TYPE]: true,
		[C.DIMENSION_TYPE]: true,
		[C.MEASURE_TYPE]: true,
	});
	const [components, setComponents] = useState([]);
	const [id, setId] = useState('');
	const [type, setType] = useState('');

	useEffect(() => {
		const dsdId = buildExtract('dsdId')(props);
		StructureAPI.getComponents(dsdId).then(res => setComponents(res));
	}, [props]);

	return (
		<div className="components">
			<div className="row text-center">
				<h2>{D.componentTitle}</h2>
			</div>
			<div className="row">
				<div className="col-md-6">
					<ComponentList
						checked={checked}
						onCheck={field =>
							setChecked({ ...checked, [field]: !checked[field] })
						}
						components={components}
						onChange={(id, type) => {
							setId(id);
							setType(type);
						}}
					/>
				</div>
				<div className="col-md-6">
					<ComponentDetail id={id} type={type} />
				</div>
			</div>
		</div>
	);
};

export default withRouter(Components);
