import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from 'index';
import { buildExtract, Panel, PageTitle } from '@inseefr/wilco';

import Controls from './controls';
import Components from './components';
import D from 'js/i18n';
import API from 'js/remote-api/dsds/dsds-api';
import { getFlag } from 'js/utils/flags/get-flag';

const DSD = props => {
	const [DSD, setDSD] = useState({});

	const { lg1, lg2 } = useContext(AppContext);

	useEffect(() => {
		const dsdId = buildExtract('dsdId')(props);
		API.getDSD(dsdId).then(res => setDSD(res));
	}, [props]);

	const { labelLg1, labelLg2, descriptionLg1, descriptionLg2 } = DSD;
	return (
		<>
			<PageTitle title={labelLg1} subtitle={labelLg2} />
			<Controls dsdId={buildExtract('dsdId')(props)} />
			<div className="row">
				{descriptionLg1 && (
					<div className={`col-md-${descriptionLg2 ? '6' : '12'}`}>
						<Panel
							title={D.descriptionTitle}
							children={descriptionLg1}
							flag={getFlag(lg1)}
						/>
					</div>
				)}
				{descriptionLg2 && (
					<div className="col-md-6">
						<Panel
							title={D.descriptionTitle}
							children={descriptionLg2}
							flag={getFlag(lg2)}
						/>
					</div>
				)}
			</div>
			<Components />
		</>
	);
};

export default DSD;
