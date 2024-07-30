import { Link } from 'react-router-dom';
import { useSeries } from '../../../../new-architecture/utils/hooks/series';
import { useOperations } from '../../../../new-architecture/utils/hooks/operations';
import { Operation } from '../../../../new-architecture/model/Operation';
import { Series } from '../../../../new-architecture/model/Series';

type WasGeneratedByBlockTypes = {
	iris: string[];
};

const generateGenericWasGeneratedBy = (
	basePath: string,
	datas: Array<Operation | Series>,
	iris: string[]
): { label: string; url: string }[] => {
	return iris
		.map((wasGeneratedIRI) => {
			return datas.find(({ iri }) => iri === wasGeneratedIRI);
		})
		.filter((data) => !!data)
		.map((data) => {
			return {
				label: data!.label,
				url: `${basePath}/${data!.id}`,
			};
		});
};

export const WasGeneratedByBlock = ({
	iris = [],
}: WasGeneratedByBlockTypes) => {
	const { data: series = [], isLoading: isSeriesLoading } = useSeries();
	const { data: operations = [], isLoading: isOperationsLoading } =
		useOperations();

	if (isSeriesLoading || isOperationsLoading) {
		return <></>;
	}

	const wasGeneratedBys = [
		...generateGenericWasGeneratedBy('/operations/series', series, iris),
		...generateGenericWasGeneratedBy('/operations/operation', operations, iris),
	];

	if (wasGeneratedBys.length === 0) {
		return <></>;
	}

	return (
		<ul>
			{wasGeneratedBys?.map(({ url, label }) => {
				return (
					<li>
						<Link key={url} to={url}>
							{label}
						</Link>
					</li>
				);
			})}
		</ul>
	);
};
