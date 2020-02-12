import React, { useState, useEffect } from 'react';
import { PageTitle, Button, SearchRmes, VerticalMenu } from 'bauhaus-library';
import API from 'js/remote-api/dsds/dsds-api';
import D from 'js/i18n';

const Home = () => {
	const [DSDs, setDSDs] = useState([]);

	useEffect(() => {
		API.getDSDs().then(res => setDSDs(res));
	}, []);

	const isLocal = process.env.REACT_APP_API_MODE === 'local';
	return (
		<div className="container">
			<div className="row">
				<VerticalMenu>
					<Button
						label={D.btnNewFemale}
						action="/dsds/create"
						col={8}
						offset={2}
					/>
					{isLocal && (
						<Button
							label={D.btnImport}
							action="/dsds/import"
							col={8}
							offset={2}
						/>
					)}
					{isLocal && (
						<Button
							label={D.btnExport}
							action="/dsds/export"
							col={8}
							offset={2}
						/>
					)}
				</VerticalMenu>
				<div className="col-md-8 centered pull-right">
					<PageTitle title={D.dsdsSearchTitle} col={12} offset={0} />
					<SearchRmes items={DSDs} childPath="dsds" autoFocus={true} />
				</div>
			</div>
		</div>
	);
};

export default Home;
