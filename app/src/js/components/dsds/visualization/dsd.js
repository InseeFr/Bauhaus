import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from 'index';
import { PageTitle, Panel } from 'bauhaus-library';
import Controls from './controls';
//import Components from './components';
import D from 'js/i18n';
import API from 'js/remote-api/dsds-api';
import buildExtract from 'js/utils/build-extract';

const DSD = props => {
	const [DSD, setDSD] = useState({});
	const [components, setComponents] = useState([]);

	const { lg1, lg2 } = useContext(AppContext);

	useEffect(() => {
		const dsdId = buildExtract('dsdId')(props);
		API.getDSD(dsdId).then(res => setDSD(res));
		API.getComponents(dsdId).then(res => setComponents(res));
	}, [props]);

	const { labelLg1, labelLg2, descriptionLg1, descriptionLg2 } = DSD;
	return (
		<>
			<PageTitle title={labelLg1} subtitle={labelLg2} context="dsds" />
			<Controls dsdId={buildExtract('dsdId')(props)} />
			<div className="row">
				{descriptionLg1 && (
					<div className={`col-md-${descriptionLg2 ? '6' : '12'}`}>
						<Panel
							title={D.descriptionTitle}
							children={descriptionLg1}
							lang={lg1}
						/>
					</div>
				)}
				{descriptionLg2 && (
					<div className="col-md-6">
						<Panel
							title={D.descriptionTitle}
							children={descriptionLg2}
							lang={lg2}
						/>
					</div>
				)}
			</div>
			{/* {components.length > 0 && <Components components={components} />} */}
		</>
	);
};

export default DSD;
