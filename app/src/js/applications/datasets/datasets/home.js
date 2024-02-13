import api from '../../../remote-api/datasets/datasets-api';
import { useQuery } from '@tanstack/react-query';
import { NewButton, PageTitle, VerticalMenu } from '@inseefr/wilco';
import D from '../../../i18n/build-dictionary';
import { Auth, SearchableList, Row } from 'bauhaus-utilities';
import React from 'react';

export const DatasetHome = () => {
	const { data } = useQuery({
		queryFn: () => api.getAll(),
		queryKey: 'datasets',
	});

	return (
		<div className="container">
			<Row>
				<VerticalMenu>
					<Auth.AuthGuard roles={[Auth.ADMIN]}>
						<NewButton
							label={D.btnNewFemale}
							action="/datasets/create"
							col={8}
							offset={2}
							wrapper={false}
						/>
					</Auth.AuthGuard>
				</VerticalMenu>
				<div className="col-md-8 text-center pull-right">
					<PageTitle title={D.datasetsTitle} col={12} offset={0} />
					<SearchableList
						items={data ?? []}
						childPath="datasets"
						autoFocus={true}
						advancedSearch={false}
						itemFormatter={(_, dataset) => dataset.label}
					/>
				</div>
			</Row>
		</div>
	);
};
