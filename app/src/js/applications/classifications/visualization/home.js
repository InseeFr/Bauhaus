import React from 'react';
import { Link } from 'react-router-dom';
import { PageSubtitle, PageTitle } from '@inseefr/wilco';
import Controls from './controls';
import General from './general';
import Notes from './notes';
import Levels from './levels';
import D from 'js/i18n';
import { CheckSecondLang, useTitle, ErrorBloc } from 'bauhaus-utilities';

const ClassificationVisualization = ({
		 classification: { general, levels },
		 classificationId,
		 secondLang,
		 langs,
		 publish,
		 serverSideError,
	}) => {

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
			<div className="row">
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
			</div>
			<Controls
				classification={general}
				publish={publish}
			/>
			<CheckSecondLang />
            {serverSideError && <ErrorBloc error={serverSideError} D={D}/>}
			<General general={general} secondLang={secondLang} langs={langs} />
			{notes.scopeNoteLg1 && (
				<Notes notes={notes} secondLang={secondLang} langs={langs} />
			)}
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
