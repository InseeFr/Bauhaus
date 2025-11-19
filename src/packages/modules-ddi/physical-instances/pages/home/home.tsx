import { Row } from '@components/layout';
import { Loading } from '@components/loading';
import { PageTitle } from '@components/page-title';
import { SearchableList } from '@components/searchable-list';

import { useTitle } from '@utils/hooks/useTitle';

import { useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { useTranslation } from 'react-i18next';
import D from '../../../../deprecated-locales';
import { usePhysicalInstances } from '../../../hooks/usePhysicalInstances';
import { useCreatePhysicalInstance } from '../../../hooks/useCreatePhysicalInstance';
import { HomePageMenu } from './menu';
import { PhysicalInstanceCreationDialog } from '../../components/PhysicalInstanceCreationDialog/PhysicalInstanceCreationDialog';

const TOAST_DURATION = 3000;

const formatDate = (dateString: string) => {
	if (!dateString) return '';
	try {
		const date = new Date(dateString);
		return date.toLocaleDateString('fr-FR');
	} catch {
		return dateString;
	}
};

export const Component = () => {
	useTitle(D.ddiTitle, D.physicalInstanceTitle);
	const { t } = useTranslation();
	const { data = [], isLoading } = usePhysicalInstances();
	const createPhysicalInstance = useCreatePhysicalInstance();
	const [visible, setVisible] = useState(false);
	const toast = useRef<Toast>(null);

	const handleSubmit = async (data: { label: string; name: string }) => {
		try {
			await createPhysicalInstance.mutateAsync({
				physicalInstanceLabel: data.label,
				dataRelationshipName: data.name,
			});

			toast.current?.show({
				severity: 'success',
				summary: t('physicalInstance.creation.successTitle'),
				detail: t('physicalInstance.creation.successMessage'),
				life: TOAST_DURATION,
			});

			setVisible(false);
		} catch (err: unknown) {
			const errorMessage =
				err && typeof err === 'object' && 'message' in err
					? String(err.message)
					: t('physicalInstance.creation.errorMessage');

			toast.current?.show({
				severity: 'error',
				summary: t('physicalInstance.creation.errorTitle'),
				detail: errorMessage,
				life: TOAST_DURATION,
			});
		}
	};

	if (isLoading) return <Loading />;

	return (
		<div className="container">
			<Row>
				<HomePageMenu onCreate={() => setVisible(true)} />
				<div className="col-md-8 text-center pull-right">
					<PageTitle
						title={D.physicalInstancSearcheTitle}
						col={12}
						offset={0}
					/>
					<SearchableList
						items={data}
						childPath={(data) => 'ddi/physical-instances/' + data.agency}
						autoFocus
						itemFormatter={(_content: any, item: any) => {
							return `${item.label} (${formatDate(item.versionDate)})`;
						}}
					/>
				</div>
			</Row>

			<PhysicalInstanceCreationDialog
				visible={visible}
				onHide={() => setVisible(false)}
				onSubmit={handleSubmit}
			/>

			<Toast ref={toast} />
		</div>
	);
};
