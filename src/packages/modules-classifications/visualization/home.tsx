import { Link } from 'react-router-dom';
import Menu from './menu';
import General from './general';
import Notes from './notes';
import Levels from './levels';
import D from '../../deprecated-locales';
import { useTitle } from '../../utils/hooks/useTitle';
import { Classification } from '../../model/Classification';
import { PageSubtitle } from '@components/page-sub-title';
import { CheckSecondLang } from '@components/check-second-lang';
import { ErrorBloc } from '@components/errors-bloc';
import { Row } from '@components/layout';
import { PageTitle } from '@components/page-title';

type ClassificationVisualizationTypes = {
	classification: Classification;
	classificationId: string;
	secondLang?: boolean;
	publish: () => void;
	serverSideError?: any;
};
const ClassificationVisualization = ({
	classification: { general, levels },
	classificationId,
	secondLang,
	publish,
	serverSideError,
}: ClassificationVisualizationTypes) => {
	useTitle(D.classificationsTitle, general?.prefLabelLg1);

	const notes = {
		scopeNoteLg1: general.scopeNoteLg1,
		scopeNoteLg2: general.scopeNoteLg2,
		changeNoteLg1: general.changeNoteLg1,
		changeNoteLg2: general.changeNoteLg2,
		descriptionLg1: general.descriptionLg1,
		descriptionLg2: general.descriptionLg2,
	};

	return (
		<div className="container">
			<PageTitle title={general.prefLabelLg1} />
			{general.prefLabelLg2 && <PageSubtitle subTitle={general.prefLabelLg2} />}
			<Row>
				<div className="col-md-12 text-center">
					<Link
						to={`/classifications/classification/${classificationId}/items`}
					>
						<h3>
							<span className="glyphicon glyphicon-zoom-in mr-1"></span>
							{D.classificationAllItemsTitle}
						</h3>
					</Link>
				</div>
			</Row>
			<Menu classification={general} publish={publish} />
			<CheckSecondLang />
			{serverSideError && <ErrorBloc error={serverSideError} D={D} />}
			<General general={general} secondLang={secondLang} />
			{notes.scopeNoteLg1 && <Notes notes={notes} secondLang={secondLang} />}
			{levels.length !== 0 && (
				<Levels
					levels={levels}
					classificationId={general.id}
					secondLang={secondLang}
				/>
			)}
		</div>
	);
};

export default ClassificationVisualization;
