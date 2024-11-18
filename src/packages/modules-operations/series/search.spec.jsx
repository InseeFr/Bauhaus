import {
	CL_FREQ,
	CL_SOURCE_CATEGORY,
} from '../../redux/actions/constants/codeList';
import { renderWithRouter } from '../../tests-utils/render';
import * as useCodesListHook from '../../utils/hooks/codeslist';
import useUrlQueryParameters from '../../utils/hooks/useUrlQueryParameters';
import { SearchFormList } from './search';

const data = [
	{
		prefLabelLg1: 'Base non-salariés',
		prefLabelLg2: 'Self-employed database',
		creators: ['DG57-C003'],
		dataCollectors: [{ id: 'DG75-A040' }],
		accrualPeriodicityList: CL_FREQ,
		typeCode: 'A',
		abstractLg1:
			"<p>L'objectif de la base non-salariés est d'étudier annuellement l'emploi et les revenus d'activité des personnes non salariées (y compris les micro-entrepreneurs).<br />\nLa base non-salariés permet de mesurer des effectifs de non-salariés et des niveaux de revenus par secteur d'activité détaillé selon la Nomenclature d'activité française (NAF rév. 2) et à un niveau infra-national (la commune d'activité étant connue).</p>",
		typeList: CL_SOURCE_CATEGORY,
		abstractLg2:
			'<p>The objective of the self-employed database is to study annually the employment and earned incomes of self-employed (including micro-entrepreneurs).<br />\nThe self-employed database enables to measure the number of non-salaried employees and their earned incomes, by sector of activity (according to the French classification of economic activities (NAF rev. 2)) and at a sub-national level (the municipality where the activity is located being known).</p>',
		historyNoteLg2:
			'<p>The self-employed database has been available since 2006.</p>',
		historyNoteLg1:
			"<p>La base non-salariés est disponible depuis l'année 2006.</p>",
		publishers: { id: 'Acoss' },
		accrualPeriodicityCode: 'A',
		id: 's1037',
		altLabelLg1: 'qsdfg',
	},
	{
		prefLabelLg1: 'Enquête emploi de Mayotte',
		prefLabelLg2: 'Labour force survey Mayotte',
		creators: ['DG57-C601'],
		typeCode: 'S',
		abstractLg1:
			'<p>Cette enqu&ecirc;te est la seule source fournissant une mesure de l\'activit&eacute;, du ch&ocirc;mage, de l&rsquo;emploi et de l&rsquo;inactivit&eacute; tels que d&eacute;finis par le Bureau international du travail (BIT). Elle s\'inscrit dans le cadre des enqu&ecirc;tes "Forces de travail" d&eacute;finies au niveau europ&eacute;en ("Labour Force Survey").</p>',
		typeList: CL_SOURCE_CATEGORY,
		abstractLg2:
			'<p>This survey is the only source that provides a measurement of activity, unemployment, employment and inactivity according to the International Labour Organization (ILO) definition. It is part of the Labour Force Surveys (LFS) defined by the European Union.</p>',
		historyNoteLg2:
			'<p>The French Labour Force Survey was established in 1950 to provide a regular measure of employment and unemployment.<br />Over the decades, the survey has incorporated numerous changes. A Labour Force Survey was conducted for the first time in Mayotte in 2009. It was based on the annual Labour Force Survey conducted in the other French overseas departments, with small adjustments. From 2013, an annual LFS is conducted every year in Mayotte.</p>',
		historyNoteLg1:
			"<p>L'enqu&ecirc;te sur l&rsquo;emploi, le ch&ocirc;mage et l&rsquo;inactivit&eacute; est n&eacute;e en France en 1950 pour permettre une mesure r&eacute;guli&egrave;re de l&rsquo;emploi et du ch&ocirc;mage.<br />Au fil des d&eacute;cennies, l&rsquo;enqu&ecirc;te a int&eacute;gr&eacute; des nombreux changements, de champ g&eacute;ographique notamment. Une enqu&ecirc;te Emploi a &eacute;t&eacute; r&eacute;alis&eacute;e pour la premi&egrave;re fois &agrave; Mayotte en 2009, sur le mod&egrave;le de l&rsquo;enqu&ecirc;te Emploi annuelle qui &eacute;tait alors r&eacute;alis&eacute;e dans les autres Dom, avec quelques adaptations du questionnaire. Depuis 2013, l&rsquo;enqu&ecirc;te Emploi annuelle Mayotte est men&eacute;e chaque ann&eacute;e.</p>",
		publishers: { id: 'DG75-F001' },
		id: 's1041',
		altLabelLg2: 'LFS Mayotte',
		altLabelLg1: 'EEA Mayotte',
	},
	{
		abstractLg1:
			"<p>L'enqu&ecirc;te de fr&eacute;quentation dans les h&eacute;bergements touristiques a pour objectif l'observation conjoncturelle de la fr&eacute;quentation et l'&eacute;tude de la structure de la client&egrave;le, notamment de son origine g&eacute;ographique.<br />Elle couvre trois types d&rsquo;&eacute;tablissements&nbsp;: les h&ocirc;tels, les campings et les autres h&eacute;bergements collectifs de tourisme (auberges de jeunesse, centres internationaux de s&eacute;jour, centres sportifs, r&eacute;sidences de tourisme et r&eacute;sidences h&ocirc;teli&egrave;res, maisons familiales de vacances et villages de vacances).</p>\r\n<p>Les informations sont produites au plan national, r&eacute;gional, voire infra-r&eacute;gional.</p>",
		typeList: CL_SOURCE_CATEGORY,
		prefLabelLg1:
			'Enquête mensuelle de fréquentation dans les hébergements collectifs de tourisme',
		abstractLg2:
			'<p>The visitor survey in tourist accommodation aims at the cyclical observation of attendance and the study of the structure of the clientele, including its geographical origin.<br />It covers three types of establishments: hotels, campings and other collective tourist accommodation (youth hostels, international centers of residence, sports centers, tourist residences and residential hotels, family holiday homes and holiday villages).</p>\r\n<p>The information is produced at the national, regional or even sub-regional levels.</p>',
		prefLabelLg2:
			'Monthly attendance survey in collective tourist accommodation',
		historyNoteLg2:
			'<p>In 2019, the three survey segments (hotels, campsites and other collective tourist accommodation) were grouped together in a single operation.</p>',
		creators: [],
		historyNoteLg1:
			'<p>En 2019, les trois segments d&rsquo;enqu&ecirc;tes (h&ocirc;tels, campings et autres h&eacute;bergements collectifs de tourisme) ont &eacute;t&eacute; regroup&eacute;s dans une seule et m&ecirc;me op&eacute;ration.</p>',
		publishers: { id: 'DG75-E001' },
		id: 's1039',
		typeCode: 'S',
	},
	{
		abstractLg1:
			'<p>Le syst&egrave;me d&rsquo;information LIFI d&eacute;crit les liaisons financi&egrave;res entre soci&eacute;t&eacute;s. Il permet d&rsquo;identifier et de caract&eacute;riser les groupes de soci&eacute;t&eacute;s op&eacute;rant en France et de d&eacute;terminer leur contour sur le territoire national. LIFI constitue ainsi le r&eacute;pertoire fran&ccedil;ais des groupes de soci&eacute;t&eacute;s. Il est un &eacute;l&eacute;ment du syst&egrave;me de r&eacute;pertoire d&rsquo;entreprises fran&ccedil;ais (SIRUS) et alimente chaque ann&eacute;e le r&eacute;pertoire europ&eacute;en des groupes (EGR) pour les groupes internationaux pr&eacute;sents en France et leurs filiales.<br />LIFI est bas&eacute; sur la connaissance la plus compl&egrave;te possible des liens de d&eacute;tention capitalistique entre soci&eacute;t&eacute;s (ou liaisons financi&egrave;res).<br />Il est aliment&eacute; par de multiples sources&nbsp; : les donn&eacute;es de la Banque de France collect&eacute;es dans le cadre de la cotation bancaire des entreprises (alimentation du Fichier Bancaire des Entreprises &ndash; FIBEN), la source fiscale (DGFIP), les donn&eacute;es commerciales (ORBIS-BvD) et les informations disponibles dans les rapports d&rsquo;activit&eacute; diffus&eacute;s par les groupes.<br />La d&eacute;tention par une soci&eacute;t&eacute; &laquo;&nbsp;m&egrave;re&nbsp;&raquo; de tout ou une partie des actions (droits de vote) d&rsquo;une soci&eacute;t&eacute; &laquo;&nbsp;fille&nbsp;&raquo; caract&eacute;rise la relation de contr&ocirc;le entre soci&eacute;t&eacute;s.<br />A partir de ces liens financiers, un algorithme de calcul d&eacute;termine les t&ecirc;tes de groupe (GGH= Global Group Head) et leur contour. Un travail d&rsquo;expertise manuel affine ensuite la d&eacute;limitation du contour et d&eacute;termine le centre de d&eacute;cision du groupe (GDC = global decision center) qui peut &ecirc;tre diff&eacute;rent de la t&ecirc;te de groupe.<br />Plusieurs notions de contour sont g&eacute;r&eacute;es : le noyau dur pour les filiales d&eacute;tenues ou contr&ocirc;l&eacute;es majoritairement (directement ou indirectement &agrave; plus de 50&nbsp;% par une t&ecirc;te de groupe), le contour &eacute;largi et la mouvance des groupes pour les filiales d&eacute;tenues ou contr&ocirc;l&eacute;es minoritairement.<br />Le groupe est trait&eacute; comme une unit&eacute; statistique &agrave; part enti&egrave;re, avec ses caract&eacute;ristiques propres (effectifs, activit&eacute; principale, nationalit&eacute;, filiales, GGH, GDC) et peut &ecirc;tre suivi dans le temps par un identifiant unique en cas de continuit&eacute; d&rsquo;une ann&eacute;e sur l&rsquo;autre.</p>',
		typeList: CL_SOURCE_CATEGORY,
		prefLabelLg1:
			'Liaisons financières, le répertoire français sur les groupes',
		creators: [],
		historyNoteLg1:
			"<p>Le syst&egrave;me d'information sur les groupes existe depuis 1979. Jusqu&rsquo;en 2011, LIFI reposait principalement sur une enqu&ecirc;te annuelle interrogeant des unit&eacute;s l&eacute;gales sur leurs actionnaires et participations. Depuis 2012, l'enqu&ecirc;te est remplac&eacute;e par l'exploitation de donn&eacute;es administratives et priv&eacute;es. L&rsquo;introduction de nouvelles sources de donn&eacute;es s&rsquo;est accompagn&eacute;e d&rsquo;une refonte du syst&egrave;me d&rsquo;information LIFI. <br />LIFI s&rsquo;est ainsi dot&eacute; d&rsquo;un nouvel applicatif et de nouveaut&eacute;s conceptuelles. Depuis le mill&eacute;sime LIFI 2015, les concepts, sources et processus sont pour l&rsquo;essentiel stabilis&eacute;s. Le nombre de groupes&nbsp;a augment&eacute; de fa&ccedil;on significative (de 53 000 en 2011 &agrave; 123 000 en 2015) traduisant un effet qualit&eacute; de la r&eacute;novation men&eacute;e, et refl&eacute;tant aussi la tendance actuelle des entreprises &agrave; s&rsquo;organiser en groupes.</p>",
		publishers: [{ id: 'DG75-E001' }],
		id: 's1038',
		altLabelLg1: 'Lifi',
		typeCode: 'C',
	},
	{
		prefLabelLg1: 'Fichier localisé des rémunérations et de l’emploi salarié',
		prefLabelLg2: 'Pay and salaried employment localized file',
		creators: [],
		typeCode: 'A',
		abstractLg1:
			'<p>Flores est un ensemble de fichiers de micro-donn&eacute;es qui d&eacute;crivent l&rsquo;emploi salari&eacute; et les r&eacute;mun&eacute;rations au niveau des &eacute;tablissements. L&rsquo;objectif principal est de servir de base &agrave; des &eacute;tudes nationales, ou le plus souvent, locales, pour d&eacute;crire le tissu &eacute;conomique d&rsquo;un territoire donn&eacute; jusqu&rsquo;au niveau de la commune.</p>\r\n<p>Flores couvre l&rsquo;ensemble de l&rsquo;emploi salari&eacute;, quel que soit le secteur d&rsquo;activit&eacute; et le type d&rsquo;employeur (public ou priv&eacute;, y compris les particuliers employeurs).</p>\r\n<p>Par rapport aux autres sources disponibles sur l&rsquo;emploi salari&eacute; au niveau local, il constitue un produit interm&eacute;diaire entre les Estimations d&rsquo;emploi d&rsquo;une part, qui sont des statistiques agr&eacute;g&eacute;es au niveaux des r&eacute;gions, d&eacute;partements et zone d&rsquo;emploi, et d&rsquo;autre part les fichiers de micro-donn&eacute;es de niveau &laquo; postes de travail &raquo;, qui sont tr&egrave;s d&eacute;taill&eacute;s mais d&rsquo;une utilisation plus complexe et destin&eacute;s en premier lieu &agrave; l&rsquo;&eacute;tude des salaires au niveau individuel.</p>\r\n<p>Chaque mill&eacute;sime de Flores contient les donn&eacute;es de deux ann&eacute;es (ici 2016 et 2017), ce qui permet de r&eacute;aliser des analyses en niveau et en &eacute;volution.</p>\r\n<p>Flores est construit pour l&rsquo;essentiel &agrave; partir du fichier &laquo; Tous salari&eacute;s &raquo; (anciennement appel&eacute; &laquo; DADS Grand format &raquo;). La mise en forme et le niveau de d&eacute;tail sont adapt&eacute;s pour une utilisation plus facile par les charg&eacute;s d&rsquo;&eacute;tude.</p>',
		typeList: CL_SOURCE_CATEGORY,
		abstractLg2:
			'<p>Flores is a set of micro-data files that describe paid employment and earnings at the establishment level (local unit of a company). The main objective is to serve as a basis for national, or more often, local studies to describe the economic fabric of a given territory down to the level of the municipality.</p>\r\n<p>Flores covers all salaried employment, whatever the sector of activity and the type of employer (public or private, including individual employers).</p>\r\n<p>Compared to the other available sources on paid employment at local level, it is an intermediate product between the Employment Estimates on the one hand, which are aggregate statistics at the level of regions, departments and employment areas, and on the other hand the micro-data files at "salaried position" level, which are very detailed but of a more complex use and intended primarily for the study of wages at individual level.</p>\r\n<p>Each Flores vintage contains data for two years (in this case 2016 and 2017), which makes it possible to carry out level and evolution analyses.</p>\r\n<p>Flores is mainly constructed from the "All employees" file (formerly called "DADS Grand format"). The formatting and level of detail are adapted for an easier use by data scientists.</p>',
		historyNoteLg2:
			'<p>The year 2017 corresponds to the first compilation of Flores, which succeeds the "Local Knowledge of the Productive System (Clap)" process.</p>\r\n<p>Compared to Clap, the main addition of Flores is the presentation of two years simultaneously in the same file (N-1 and N), which makes it possible to calculate annual changes.</p>',
		historyNoteLg1:
			'<p>L&rsquo;exercice 2017 correspond &agrave; la premi&egrave;re r&eacute;alisation de Flores, qui succ&egrave;de au processus de &laquo; Connaissance locale de l&rsquo;appareil productif (Clap) &raquo;.</p>\r\n<p>Par rapport &agrave; Clap, le principal ajout de Flores est la pr&eacute;sentation de deux ann&eacute;es simultan&eacute;ment dans le m&ecirc;me fichier (N-1 et N), ce qui permet de calculer des &eacute;volutions annuelles.</p>',
		publishers: { id: 'DG75-F201' },
		id: 's1042',
		altLabelLg2: 'Flores',
		altLabelLg1: 'Flores',
	},
	{
		abstractLg1:
			'<p>L&rsquo;enqu&ecirc;te sur la production et la gestion des d&eacute;chets dans le secteur tertiaire en Hauts-de-France en 2019 doit permettre de combler l&rsquo;absence de donn&eacute;es sur la production et la gestion des d&eacute;chets dans les &eacute;tablissements du secteur tertiaire dans les Hauts-de-France. <br />Les donn&eacute;es collect&eacute;es permettront aux repr&eacute;sentants de l&rsquo;&Eacute;tat et de la R&eacute;gion de r&eacute;aliser un suivi des orientations retenues dans le volet d&eacute;chets du Sch&eacute;ma r&eacute;gional d&rsquo;am&eacute;nagement, de d&eacute;veloppement durable et d&rsquo;&eacute;galit&eacute; des territoires (SRADDET) et contribuer &agrave; la mise en place &agrave; partir de 2020 d&rsquo;un observatoire r&eacute;gional sur les d&eacute;chets. En effet, la r&eacute;gion des Hauts-de-France est l&rsquo;une des seules r&eacute;gions fran&ccedil;aises &agrave; ne pas encore &ecirc;tre dot&eacute;e d&rsquo;un observatoire des d&eacute;chets.</p>',
		typeList: CL_SOURCE_CATEGORY,
		prefLabelLg1:
			'Enquête sur la production et la gestion des déchets dans le secteur tertiaire en Hauts-de-France',
		abstractLg2:
			'<p>The survey on waste generation and management in the tertiary sector in Hauts-de-France in 2019 should make it possible to fill the gap in data on waste generation and management in tertiary sector establishments in the Hauts-de-France. The data collected will enable State and Regional representatives to monitor the orientations adopted in the waste component of the Regional Planning, Sustainable Development and Equality of Territories Scheme (SRADDET) and contribute to the establishment of a regional waste observatory from 2020 onwards. Indeed, the Hauts-de-France region is one of the only French regions that does not yet have a waste observatory. </p>',
		prefLabelLg2:
			'Survey on waste generation and management in the tertiary sector in Hauts-de-France',
		historyNoteLg2:
			'<p>The survey on waste production and management in the tertiary sector in Hauts-de-France in 2019 is an experimental survey.</p>',
		creators: [],
		historyNoteLg1:
			'<p>L&rsquo;enqu&ecirc;te sur la production et la gestion des d&eacute;chets dans le secteur tertiaire en Hauts-de-France en 2019 est une enqu&ecirc;te exp&eacute;rimentale</p>',
		publishers: { id: 'Insee' },
		id: 's1040',
		typeCode: 'S',
	},
];
const organisations = [
	{ value: 'Acoss', label: 'Acoss' },
	{ value: 'DG75-A040', label: 'DG75-A040' },
];
const stamps = ['DG57-C003'];

vi.spyOn(useCodesListHook, 'useCodesList').mockImplementation(() => {
	return {
		codes: [{ code: 'S', labelLg2: 'Survey', labelLg1: 'Enquete' }],
	};
});

vi.mock('../../utils/hooks/useUrlQueryParameters');

vi.mock('../../utils/hooks/organizations', () => ({
	useOrganizationsOptions: () => {
		return organisations;
	},
}));

describe('<SearchFormList />', () => {
	it('should return all data when the form is empty', () => {
		const form = {};
		useUrlQueryParameters.mockReturnValue({ form });

		const { container } = renderWithRouter(
			<SearchFormList data={data} stamps={stamps} />,
		);
		expect(container.querySelectorAll('li')).toHaveLength(6);
	});

	it('should filter by prefLabelLg1', () => {
		const form = { prefLabelLg1: 'Base' };
		useUrlQueryParameters.mockReturnValue({ form });

		const { container } = renderWithRouter(
			<SearchFormList data={data} stamps={stamps} />,
		);
		expect(container.querySelectorAll('li')).toHaveLength(1);
	});
	it('should filter by typeCode', () => {
		const form = { typeCode: 'S' };
		useUrlQueryParameters.mockReturnValue({ form });
		const { container } = renderWithRouter(
			<SearchFormList data={data} stamps={stamps} />,
		);
		expect(container.querySelectorAll('li')).toHaveLength(3);
	});
	it('should filter by creators', async () => {
		const form = { creator: 'DG57-C003' };
		useUrlQueryParameters.mockReturnValue({ form });
		const { container } = renderWithRouter(
			<SearchFormList data={data} stamps={stamps} />,
		);

		expect(container.querySelectorAll('li')).toHaveLength(1);
	});

	it('should filter by publishers', async () => {
		const form = { publisher: 'Acoss' };
		useUrlQueryParameters.mockReturnValue({ form });
		const { container } = renderWithRouter(
			<SearchFormList data={data} stamps={stamps} />,
		);

		expect(container.querySelectorAll('li')).toHaveLength(1);
	});

	it('should filter by dataCollector', async () => {
		const form = { dataCollector: 'DG75-A040' };
		useUrlQueryParameters.mockReturnValue({ form });
		const { container } = renderWithRouter(
			<SearchFormList data={data} stamps={stamps} />,
		);

		expect(container.querySelectorAll('li')).toHaveLength(1);
	});
});
