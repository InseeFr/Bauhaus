import { useQuery } from '@tanstack/react-query';
import api from '../../../remote-api/distributions-api';
import { NewButton, PageTitle, VerticalMenu } from '@inseefr/wilco';
import { Auth, SearchableList } from 'bauhaus-utilities';
import D from '../../../i18n/build-dictionary';
import React from 'react';

export const DistributionHome = () => {
	const { data } = useQuery({
		queryFn: () => api.getAll(),
		queryKey: 'distributions',
	});

	return (
		<div className='container'>
			<div className='row'>
				<VerticalMenu>
					<Auth.AuthGuard roles={[Auth.ADMIN]}>
						<NewButton
							label={D.btnNewFemale}
							action="/datasets/distributions/create"
							col={8}
							offset={2}
							wrapper={false}
						/>
					</Auth.AuthGuard>
				</VerticalMenu>
				<div className='col-md-8 text-center pull-right'>
					<PageTitle title={D.distributionsTitle} col={12} offset={0} />
					<SearchableList
						items={data ?? []}
						childPath='datasets/distributions'
						autoFocus={true}
						advancedSearch={false}
						itemFormatter={(_, dataset) => dataset.labelLg1}
					/>
				</div>
			</div>
		</div>
	)
}
