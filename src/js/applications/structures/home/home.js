import { useState, useEffect } from 'react';
import { PageTitle } from '@inseefr/wilco';
import StructureAPI from '../apis/structure-api';
import D from 'js/i18n';
import { useTitle, SearchableList } from 'js/utils';
import { HomePageMenu } from './menu';
const Home = () => {
	useTitle(D.structuresTitle, D.structuresTitle);
	const [DSDs, setDSDs] = useState([]);

	useEffect(() => {
		StructureAPI.getStructures().then((res) => {
			setDSDs(res);
		});
	}, []);

	return (
		<div className="container">
			<div className="row">
				<HomePageMenu />
				<div className="col-md-8 text-center pull-right">
					<PageTitle title={D.dsdsSearchTitle} col={12} offset={0} />
					<SearchableList
						items={DSDs}
						childPath="structures"
						autoFocus={true}
						advancedSearch={true}
						searchUrl="/structures/search"
						itemFormatter={(_, structure) => structure.labelLg1}
					/>
				</div>
			</div>
		</div>
	);
};

export default Home;
