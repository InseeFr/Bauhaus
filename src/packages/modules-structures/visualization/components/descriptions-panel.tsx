import { Note } from '@inseefr/wilco';
import { D1, D2 } from '../../../deprecated-locales';
import { Row } from '../../../components';
import { useSecondLang } from '../../../redux/second-lang';

type DescriptionsPanelTypes = {
	descriptionLg1: string;
	descriptionLg2: string;
};
export const DescriptionsPanel = ({
	descriptionLg1,
	descriptionLg2,
}: Readonly<DescriptionsPanelTypes>) => {
	const secondLang = useSecondLang();

	return (
		<Row>
			<Note
				title={D1.descriptionTitle}
				text={descriptionLg1}
				alone={!secondLang}
				allowEmpty={true}
			/>
			{secondLang && (
				<Note
					title={D2.descriptionTitle}
					text={descriptionLg2}
					alone={false}
					allowEmpty={true}
				/>
			)}
		</Row>
	);
};
