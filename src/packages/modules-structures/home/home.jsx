import { useState, useEffect } from 'react';
import { PageTitle, Row, SearchableList } from '../../components';
import D from '../../deprecated-locales';
import { HomePageMenu } from './menu';
import { useTitle } from '../../utils/hooks/useTitle';
import { StructureApi } from '../../sdk';

export const Component = () => {
	useTitle(D.structuresTitle, D.structuresTitle);
	const [DSDs, setDSDs] = useState([]);

	useEffect(() => {
		StructureApi.getStructures().then((res) => {
			setDSDs(res);
		});
	}, []);

	return (
		<div className="container">
			<Row>
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
			</Row>
		</div>
	);
};
