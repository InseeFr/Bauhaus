import { useEffect, useState } from 'react';
import { PageTitle, Row, SearchableList } from '../../components';
import D from '../../deprecated-locales';
import {
	PartialStructure,
	StructuresList,
} from '../../model/structures/Structure';
import { StructureApi } from '../../sdk';
import { useTitle } from '../../utils/hooks/useTitle';
import { HomePageMenu } from './menu';

export const Component = () => {
	useTitle(D.structuresTitle, D.structuresTitle);
	const [DSDs, setDSDs] = useState<StructuresList>([]);

	useEffect(() => {
		StructureApi.getStructures().then((res: StructuresList) => {
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
						itemFormatter={(_: unknown, structure: PartialStructure) =>
							structure.labelLg1
						}
					/>
				</div>
			</Row>
		</div>
	);
};
