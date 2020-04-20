import React, { useState, useEffect } from 'react';
import {
	PageTitle,
	Button,
	SearchableList,
	VerticalMenu,
} from '@inseefr/wilco';
import { StructureAPI } from 'bauhaus-structures';
import D from 'js/i18n';

const Home = () => {
	const [DSDs, setDSDs] = useState([]);

	useEffect(() => {
		StructureAPI.getStructures().then(res => setDSDs(res));
	}, []);

	const isLocal = process.env.REACT_APP_API_MODE === 'local';
	return (
		<div className="container">
			<div className="row">
				<VerticalMenu>
					<Button
						label={D.btnNewFemale}
						action="/structures/create"
						col={8}
						offset={2}
					/>
					{isLocal && (
						<Button
							label={D.btnImport}
							action="/structures/import"
							col={8}
							offset={2}
						/>
					)}
					{isLocal && (
						<Button
							label={D.btnExport}
							action="/structures/export"
							col={8}
							offset={2}
						/>
					)}
				</VerticalMenu>
				<div className="col-md-8 text-center pull-right">
					<PageTitle title={D.dsdsSearchTitle} col={12} offset={0} />
					<SearchableList
						items={DSDs}
						childPath="structures"
						autoFocus={true}
					/>
				</div>
			</div>
		</div>
	);
};

export default Home;
