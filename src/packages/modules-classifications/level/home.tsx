import { PageTitle, CheckSecondLang } from '../../components';
import Controls from './controls';
import General from './general';
import Members from './members';
import { PageSubtitle } from '../../components/page-sub-title';

const LevelVisualization = ({ level: { general, members }, secondLang }) => {
	const { classificationId } = general;
	return (
		<div className="container">
			<PageTitle title={general.prefLabelLg1} />
			{general.prefLabelLg2 && <PageSubtitle subTitle={general.prefLabelLg2} />}
			<Controls id={classificationId} />
			<CheckSecondLang />
			<General
				general={general}
				classificationId={classificationId}
				secondLang={secondLang}
			/>
			{members.length !== 0 && (
				<Members
					members={members}
					classificationId={classificationId}
					secondLang={secondLang}
				/>
			)}
		</div>
	);
};

export default LevelVisualization;
