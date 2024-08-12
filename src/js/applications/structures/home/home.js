import { useState, useEffect } from 'react';
import { PageTitle } from '../../../new-architecture/components';
import StructureAPI from '../apis/structure-api';
import D from '../../../i18n';
import { SearchableList } from '../../../utils';
import { HomePageMenu } from './menu';
import { useTitle } from '../../../new-architecture/utils/hooks/useTitle';
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
