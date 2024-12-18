import { Rubric } from '../../../../model/Sims';

interface SimsBlockGeographyTypes {
	currentSection: Rubric;
	isSecondLang: boolean;
}

const SimsBlockGeography = ({
	currentSection,
	isSecondLang,
}: Readonly<SimsBlockGeographyTypes>) => {
	return (
		<>{isSecondLang ? currentSection.labelLg2 : currentSection.labelLg1}</>
	);
};
export default SimsBlockGeography;
