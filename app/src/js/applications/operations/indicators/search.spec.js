import { SearchFormList } from './search';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
const data = [
	{
		idSims: '1788',
		abstractLg1:
			"<p>Les indices de production dans les services (IPS) en volume permettent de mesurer mensuellement l'évolution de la production en volume des entreprises relevant des secteurs concernés.</p><p>Du fait du poids croissant des services en France mais également dans l’ensemble des pays européens, l'Insee élabore depuis 2017 un indice de production dans les services. Comme l’indice de la production dans l'industrie (IPI), cet indice est calculé mensuellement. Il est publié 60 jours après la fin du mois, comme les indices de chiffres d’affaires en valeur dont il est issu. </p><p>Les indices de production dans les services relèvent du règlement européen sur les statistiques de court-terme (règlement CE dit \" STS \" n°1165/98 du conseil du 19 mai 1998, modifié par ses amendements ultérieurs).</p>",
		prefLabelLg1: 'Indice de production dans les services base 2010',
		abstractLg2:
			'<p>The services  production indexes  in volume make it possible to measure monthly theevolution of the production in volume of the companies in the sectors concerned.</p><p>Due to the increasing weight of services in France but also in all European countries, INSEE has been developing an index of production in services since 2017. Like the Industrial production index (IPI), this index is calculated monthly. It is published 60 days after the end of the month, as the turnover indexes in value from which it is derived.</p><p>Production indices in services are covered by the European regulation on short-term statistics (Council Regulation (EC) No 1165/98 of 19 May 1998, as amended by its subsequent amendments).</p>',
		prefLabelLg2: 'Services Production index base 2010',
		historyNoteLg2:
			'<p>In order to limit the statistical burden on businesses, and because information is collected on a regular basis by DGFiP, INSEE uses the value added tax (VAT) tax returns of companies to build  monthly indices of turnover.</p><p>The tax authority provides INSEE with VAT returns every month. </p><p>Until 2015, turnover indices were calculated from a sample of companies reporting VAT on a monthly basis.</p><p>This sample, of some 160,000 companies, was renewed each year. It included an exhaustive stratum (the largest companies in each sector) and was drawn proportionally to turnover on the rest of the field.</p><p>Since 2016, all monthly returns are used to calculate the indices.</p><p>Beginning in 2017, INSEE calculates an index of production in services by deflating turnover indices in value: it traces the evolution of production in services.</p>',
		creators: ['DG57-C060', 'DG57-C601', 'DG57-C701'],
		historyNoteLg1:
			"<p>Dans le souci de limiter la charge statistique pesant sur les entreprises, et parce que l'information est collectée de manière régulière par la DGFiP, l'Insee utilise les déclarations de taxe sur la valeur ajoutée (TVA) des entreprises pour bâtir un ensemble d'indices mensuels d'évolution des chiffres d'affaires.</p><p>La DGFiP transmet mensuellement à l'Insee les déclarations TVA des entreprises.</p><p>Jusqu'en 2015, les indices de chiffre d'affaires étaient calculés à partir d'un échantillon d'entreprises déclarant la TVA mensuellement.</p><p>Cet échantillon, de quelque 160 000 entreprises, était renouvelé chaque année. Il comprenait une strate exhaustive (les plus grandes entreprises de chaque secteur) et était tiré proportionnellement au chiffre d'affaires sur le reste du champ.</p><p>Depuis 2016, toutes les déclarations mensuelles sont exploitées pour le calcul des indices.</p><p>À partir de 2017 l'Insee calcule un indice de production dans les services par déflation des indices de chiffres d'affaires en valeur : il retrace l’évolution de la production dans les services.</p>",
		publishers: [{ id: 'DG75-L002' }],
		id: 'p1647',
		dataCollector: [],
		altLabelLg1: '',
	},
	{
		idSims: '1888',
		abstractLg1:
			"<p>Du fait du poids croissant des services en France et dans l’ensemble des pays européens, l'Insee élabore depuis 2017 des indices de production dans les services (IPS). Ils permettent de mesurer mensuellement, et de façon précoce, l’évolution de la production des entreprises relevant de ces secteurs. Ils représentent à ce titre une information essentielle pour le suivi du cycle conjoncturel. Ces indices relèvent également du règlement européen sur les statistiques de court-terme (règlement CE dit « STS » n°1165/98 du conseil du 19 mai 1998, modifié par ses amendements ultérieurs).</p>",
		prefLabelLg1: 'Indice de production dans les services base 2015',
		abstractLg2:
			'<p>Due to the increasing weight of services in France but also in all European countries, INSEE has been developing an index of production in services since 2017. The services production indices are used to measure the monthly change in the services production of the companies in the sectors concerned. As such, they are a primary information to monitor the business cycle in France. Production indices in services fall under the European regulation on short-terms statistics – the Council Regulation ‘’STS’’ No 1165/98 of 19 May 1998, modified by subsequent amendments.</p>',
		prefLabelLg2: 'Services Production index base 2015',
		creators: [],
		publishers: [],
		id: 'p1671',
		dataCollector: [],
		altLabelLg1: '',
	},
	{
		idSims: '1774',
		abstractLg1:
			"<p>Les indices de volume des ventes dans le commerce de détail et les services personnels constituent un indicateur mensuel d'évolution de l'activité des entreprises relevant des secteurs concernés.</p><p>Des indices de chiffre d'affaires (ICA) en valeur sont également publiés pour les mêmes secteurs ; ils sont représentatifs de l'évolution des ventes en valeur.</p><p>Les indices de volume des ventes et de chiffre d'affaires dans le commerce de détail et les services personnels répondent à un impératif national et européen.</p><p>Ils relèvent du règlement européen sur les statistiques de court-terme (règlement CE dit \" STS \" n°1165/98 du conseil du 19 mai 1998, modifié par ses amendements ultérieurs).</p>",
		prefLabelLg1:
			"Indice de chiffre d'affaires dans le commerce de détail et les services personnels",
		abstractLg2:
			'<p>Sales indices in retail trade and personal services make it possible to measure the monthly developments in the volumes of sales in the sectors concerned. Turnover indices in value in the same sectors are also available.</p><p>Sales indices and turnover indices in retail trade and personal services focus on a national and European need. They relate to the European regulations on short-term statistics ("STS" EC regulation n° 1165/98 of the Council of 19 May 1998, updated by subsequent amendments). </p>',
		prefLabelLg2: 'Sales index in retail trade and personal services',
		historyNoteLg2:
			"<p>In order to reduce the statistical burden on businesses and because the data has been collected on a regular basis, Insee obtained the ability to use businesses' value-added tax (VAT) declarations in order to calculate a set of monthly indices showing the developments of turnover.</p><p>The Tax General Directorate transmits to the Insee the declarations of VAT. Until 2015, the index of turnover were calculated from a sample of companies declaring the VAT monthly, selected by INSEE.</p><p>This sample of almost 160 000 companies was renewed on an annual basis. It includes an exhaustive section (the largest businesses in each sector) and is selected in proportion of the turnover over the rest of the field.</p><p>From 2016, all the monthly declarations are exploited for the calculation of the indices.</p>",
		creators: [],
		historyNoteLg1:
			"<p>Dans le souci de limiter la charge statistique pesant sur les entreprises, et parce que l'information était collectée de manière régulière, l'Insee a obtenu de pouvoir utiliser les déclarations de taxe sur la valeur ajoutée (TVA) des entreprises pour bâtir un ensemble d'indices mensuels d'évolution des chiffres d'affaires.</p><p>La DGFiP transmet donc à l'Insee les déclarations TVA des entreprises. Jusqu'en 2015, les indices de chiffre d'affaires étaient calculés à partir d'un échantillon d'entreprises déclarant la TVA mensuellement sélectionnées par l'Insee.</p><p>Cet échantillon, de quelque 160 000 entreprises, était renouvelé chaque année. Il comprenait une strate exhaustive (les plus grandes entreprises de chaque secteur) et était tiré proportionnellement au chiffre d'affaires sur le reste du champ.</p><p>À partir de 2016, toutes les déclarations mensuelles sont exploitées pour le calcul des indices.</p>",
		publishers: [],
		id: 'p1633',
		dataCollector: [],
		altLabelLg1: '',
	},
	{
		idSims: '1776',
		abstractLg1:
			"<p>Les indices de chiffres d'affaires (ICA) dans le commerce de gros et divers services aux entreprises permettent de mesurer mensuellement l'évolution des ventes en valeur des entreprises relevant des secteurs concernés.</p><p>Les statistiques des indices de chiffre d'affaires dans le commerce de gros et divers services aux entreprises répondent à un impératif national et européen.</p><p>Ils relèvent du règlement européen sur les statistiques de court-terme (règlement CE dit \" STS \" n°1165/98 du conseil du 19 mai 1998, modifié par ses amendements ultérieurs).</p>",
		prefLabelLg1:
			"Indice de chiffre d'affaires dans le commerce de gros et divers services aux entreprises",
		abstractLg2:
			'<p>Turnover indices in wholesale trade and business services are used to measure in value the developments of sales on a monthly basis in the sectors concerned.</p><p>Turnover indices of wholesale trade and business services focus on a national and European need. They are subject to the European regulation on short-term statistics (EC "STS" regulation n°1165/98 of the Council of May 19, 1998, updated by subsequent amendments).</p>',
		prefLabelLg2: 'Turnover index in the wholesale trade and business services',
		historyNoteLg2:
			"<p>In order to reduce the statistical burden on businesses and because the data has been collected on a regular basis, INSEE obtained the ability to use businesses' value-added tax (VAT) declarations in order to calculate a set of monthly indices showing the evolution of turnover.</p><p>The Tax General Directorate transmits to the Insee the declarations of VAT. Until 2015, the index of turnover were calculated from a sample of companies declaring the VAT monthly, selected by INSEE.</p><p>This sample of almost 160 000 companies was renewed on an annual basis. It includes an exhaustive section (the largest businesses in each sector) and is selected in proportion of the turnover over the rest of the field.</p><p>From 2016, all the monthly declarations are exploited for the calculation of the indices.</p>",
		creators: [],
		historyNoteLg1:
			"<p>À compter du 1er avril 2017, la méthodologie change :  voir Indice de chiffre d'affaires dans le commerce et Volume des ventes dans le commerce</p><p>Dans le souci de limiter la charge statistique pesant sur les entreprises, et parce que l'information était collectée de manière régulière, l'Insee a obtenu de pouvoir utiliser les déclarations de taxe sur la valeur ajoutée (TVA) des entreprises pour bâtir un ensemble d'indices mensuels d'évolution des chiffres d'affaires.</p><p>La DGFiP transmet donc à l'Insee les déclarations TVA des entreprises. Jusqu'en 2015, les indices de chiffre d'affaires étaient calculés à partir d'un échantillon d'entreprises déclarant la TVA mensuellement sélectionnées par l'Insee.</p><p>Cet échantillon, de quelque 160 000 entreprises, était renouvelé chaque année. Il comprenait une strate exhaustive (les plus grandes entreprises de chaque secteur) et était tiré proportionnellement au chiffre d'affaires sur le reste du champ.</p><p>À partir de 2016, toutes les déclarations mensuelles sont exploitées pour le calcul des indices.</p>",
		publishers: [],
		id: 'p1635',
		dataCollector: [],
		altLabelLg1: '',
	},
	{
		idSims: '1781',
		prefLabelLg1: 'Indice des prix à la production des services',
		prefLabelLg2: 'Service producer price index',
		creators: [],
		dataCollector: [],
		abstractLg1:
			"<p>Les indices des prix de production dans les services répondent à un impératif national et européen, voire international, en permettant :</p><p>- aux économistes, d'évaluer et d'analyser les tendances de la conjoncture. De nombreux organismes publics ou privés, français, européens ou mondiaux utilisent ces indices de prix comme indicateurs conjoncturels en tant que tels et comme indicateurs avancés de l'inflation (Banque centrale européenne, Commission européenne, Organisation de coopération et de développement économique (OCDE), Fonds monétaire international (FMI), etc. ). Ces indices permettent un suivi mensuel des prix, sur différents marchés, aux différents stades du processus de production. L'agrégation des indices de prix des États membres permet d'établir l'indice de prix de production des services (vendus aux entreprises, ou à l'ensemble des marchés) pour l'ensemble de l'Union Européenne ;</p><p>- aux comptables nationaux de déflater la production issue des statistiques structurelles d'entreprises et d'effectuer ainsi le partage entre l'évolution de l'activité en volume et l'évolution des prix (\" partage volume-prix \"). In fine, ils peuvent ainsi déterminer l'évolution du volume du produit intérieur brut (PIB) ;</p><p>- aux entreprises d'indexer des contrats (à partir des \" prix de marché\").</p>",
		abstractLg2:
			'<p>Services producer price indices satisfy national, European or even international requirements. Thanks to these indices :</p><p>- Economists can evaluate and analyze economic trends. Many French, European and international public and private organizations use them as economic indicators and as leading indicators for inflation (European Central Bank (ECB), International Monetary Fund (IMF), Organization for Economic Cooperation and Development (OECD), etc). These indices provide a monthly price monitoring, on different markets at all stages of the production process. The aggregation of price indices in the Member States enable to establish the services producer price indices (for services sold to businesses, or to all the markets) in the whole European Union;</p><p>- National accountants can deflate the production that comes from corporate structural statistics and thus to carry out the sharing between the development of the activity in volume and the development of prices ("price-volume" sharing). In fine, they can thus calculate the evolution of Gross Domestic Product in volume and price ;</p><p>- Enterprises can index contracts (using "market price").</p>',
		historyNoteLg2:
			'<p>The construction of the "services to businesses" producer price indices was launched in 1992 and ended in 1994 with a publication of first indices. Collection and dissemination of services prices are quarterly. The " STS-package ", wich is currently being defined, requires an extension of the scope of services to all market services sections H to N excluding K (financial services), with a view all markets ("BtoAll"), therefore beyond services to businesses. This STS-package should be included under "FRIBS" regulation. France added the S95 division in sections H to N.</p><p>SOeS was in charge of the project management of price indices for various freight transport since 2002. At the beginning of 2013, the project management of these indices was transferred to INSEE.</p>',
		historyNoteLg1:
			'<p>Le chantier des indices de prix de production des " services aux  entreprises " a été lancé en 1992 et a débouché en 1994 sur la publication des premiers indices. La collecte et la diffusion des prix des services aux entreprises sont trimestrielles. Le " STS-package ", en cours de définition, requiert une extension du champ des services à l\'ensemble des services marchands des sections H à N hors K (services financiers), dans une optique tous marchés (" BtoAll "), donc au-delà des services aux entreprises. Ce STS-package devrait être inclus dans le règlement cadre " FRIBS ". La France a ajouté la division S95 aux sections H à N.</p><p>Le SOeS assurait la maîtrise d\'ouvrage des indices des prix de divers transports de marchandises depuis 2002. Début 2013, la maîtrise d\'ouvrage de ces indices a été transférée à l\'Insee.</p>',
		publishers: [],
		id: 'p1640',
		altLabelLg2: 'SPPI',
		altLabelLg1: 'Ipse',
	},
	{
		idSims: '1778',
		abstractLg1:
			'<p>Les indices de chiffres d\'affaires (ICA) en valeur dans les services permettent de mesurer mensuellement l\'&eacute;volution des ventes&nbsp;en valeur des entreprises relevant des secteurs concern&eacute;s.</p>\r\n<p>Ils rel&egrave;vent du r&egrave;glement europ&eacute;en sur les statistiques de court-terme (r&egrave;glement CE dit "&nbsp;STS&nbsp;"&nbsp;n&deg;1165/98 du conseil du 19 mai 1998, modifi&eacute; par ses amendements ult&eacute;rieurs).</p>',
		prefLabelLg1: "Indice de chiffre d'affaires dans les services",
		abstractLg2:
			'<p>Turnover indexes in value for services make it possible to measure monthly changes in sales by value of companies in the sectors concerned.</p><p>They fall under the European regulation on short-term statistics (Council Regulation (EC) No 1165/98 of 19 May 1998, as amended by its subsequent amendments).</p>',
		prefLabelLg2: 'Turnover index in services',
		historyNoteLg2:
			'<p>In order to limit the statistical burden on businesses, and because information is collected on a regular basis by DGFiP, INSEE uses the value added tax (VAT) tax returns of companies to build a Monthly indices of turnover.</p><p>The tax authority provides INSEE with VAT returns every month..</p><p>Until 2015, turnover indices were calculated from a sample of companies reporting VAT on a monthly basis.</p><p>This sample, of some 160,000 companies, was renewed each year. It included an exhaustive stratum (the largest companies in each sector) and was drawn proportionally to turnover on the rest of the field.</p><p>Since 2016, all monthly returns are used to calculate the indices.</p>',
		creators: [],
		historyNoteLg1:
			"<p>Dans le souci de limiter la charge statistique pesant sur les entreprises, et parce que l'information est collectée de manière régulière par la DGFiP, l'Insee utilise les déclarations de taxe sur la valeur ajoutée (TVA) des entreprises pour bâtir un ensemble d'indices mensuels d'évolution des chiffres d'affaires.</p><p>La DGFiP transmet mensuellement à l'Insee les déclarations TVA des entreprises.</p><p>Jusqu'en 2015, les indices de chiffre d'affaires étaient calculés à partir d'un échantillon d'entreprises déclarant la TVA mensuellement.</p><p>Cet échantillon, de quelque 160 000 entreprises, était renouvelé chaque année. Il comprenait une strate exhaustive (les plus grandes entreprises de chaque secteur) et était tiré proportionnellement au chiffre d'affaires sur le reste du champ.</p><p>Depuis 2016, toutes les déclarations mensuelles sont exploitées pour le calcul des indices.</p>",
		publishers: [],
		id: 'p1637',
		dataCollector: [],
		altLabelLg1: '',
	},
	{
		idSims: '1794',
		prefLabelLg1: 'Indice des prix à la consommation',
		prefLabelLg2: 'Consumer price index',
		creators: [],
		dataCollector: [],
		abstractLg1:
			"<p>L'indice des prix à la consommation (IPC) est l'instrument de mesure de l'inflation. Il permet d'estimer, entre deux périodes données, la variation moyenne des prix des produits consommés par les ménages.</p><p>Il est basé sur l'observation d'un panier fixe de biens et services, actualisé chaque année. Chaque produit est pondéré, dans l'indice global, proportionnellement à son poids dans la dépense de consommation des ménages.</p><p>Il est publié chaque mois au Journal Officiel. L'indice des prix hors tabac sert à indexer de nombreux contrats privés, des pensions alimentaires, des rentes viagères et aussi à indexer le SMIC.</p><p>L'indice retenu pour le SMIC est celui des \"ménages du premier quintile de la distribution des niveaux de vie\" (Décret n°2013-123 du 7 février 2013).</p>",
		abstractLg2:
			'<p>The consumer price index (CPI) is the instrument used to measure inflation. It allows the estimation of the average variation between two given periods in the prices of products consumed by households.</p><p>It is based on the observation of a fixed basket of goods updated every year. Each product has a weight in the overall index that is proportional to its weight in household expenditure.</p><p>It is published each month in the Official Journal of French Republic. The price index excluding tobacco is used to index link many private contracts, alimony, annuities and also the minimum wage (SMIC).</p><p>The index used for the SMIC is that of the "Households that belong to the lowest equivalized disposable income quintile" (Decree n° 2013-123, February 7th of 2013).</p>',
		historyNoteLg2:
			"<p>The first generation of indices dates back to 1914. Over time, the IPC's coverage has broadened, both on a geographical level and in terms of the population represented and consumption covered.</p><p>The CPI 2015 base constitutes the 8th generation of indices used. It was brought into service in January 2016.</p>",
		historyNoteLg1:
			"<p>La première génération d'indices date de 1914. Au cours du temps, la couverture de l'IPC s'est élargie tant au plan géographique qu'en termes de population représentée ou de consommation couverte.</p><p>L'IPC base  2015 constitue la  8e génération d'indice. Il est entré en service en janvier  2016.</p>",
		publishers: [],
		id: 'p1653',
		altLabelLg2: 'CPI',
		altLabelLg1: 'IPC',
	},
	{
		idSims: '1770',
		prefLabelLg1: 'Indice du coût horaire du travail révisé - tous salariés',
		prefLabelLg2: 'Revised Hourly Labour Cost Index - all employees',
		creators: [],
		dataCollector: [],
		abstractLg1:
			"<p>L'indice du coût horaire du travail révisé - tous salariés (ICHTrev-TS) permet de suivre l'évolution mensuelle du coût horaire du travail (rémunérations, cotisations sociales, taxes nettes de subventions) et sert de référence pour certaines clauses d'indexations contractuelles.</p><p>Le calcul de cet indice répond à un impératif national et européen. Il relève du règlement européen sur les statistiques de court-terme (règlement CE dit \"STS\" n° 1165/98, modifié par le règlement CE n° 1158/2005).</p>",
		abstractLg2:
			'<p>The revised Hourly Labour Cost Index - all Employees (ICHTrev-TS) allows the monitoring of monthly trends in the hourly cost of labour (remunerations, social contributions and taxes inclusive of subsidies) and acts as a reference for certain contractual indexing clauses.</p><p>This index is calculated in response to a national and European requirement. It relates to the European regulations on short-term statistics ("STS" EC regulation no.1165/98, amended by EC regulation no. 1158/2005).</p>',
		historyNoteLg2:
			'<p>This index was calculated for the first time in 2009. It replaces the ICHT-TS, created in 1996, which was calculated on a "structure-constant" basis, i.e. not taking account of any changes to the description of jobs or of their distribution according to gender.</p><p>The old-formula ICHT-TS only covered 4 specific business sectors (Mechanical and Electrical Industries, Textile, Leather and Clothing, and Services provided primarily to enterprises).</p>',
		historyNoteLg1:
			"<p>Cet indice est calculé pour la première fois en 2009. Il remplace l'ICHT-TS, crée en 1996 qui était calculé \"à structure constante\", c'est-à-dire ne prenant pas en compte les changements éventuels de qualification des emplois ou de leur répartition par sexe.</p><p>L'ICHT-TS, ancienne formule, ne couvrait que 4 secteurs d'activité spécifiques (Industries Mécaniques et Électriques, Textile, Habillement-cuir et Services fournis principalement aux entreprises).</p>",
		publishers: [],
		id: 'p1629',
		altLabelLg2: 'ICHTrev-TS',
		altLabelLg1: 'ICHTrev-TS',
	},
	{
		idSims: '1887',
		abstractLg1:
			'<p>Les indices de volume des ventes dans le commerce permettent de mesurer mensuellement, et de façon précoce, l’évolution des ventes des entreprises relevant des secteurs concernés. Ils représentent à ce titre une information essentielle pour le suivi du cycle conjoncturel. Ces indices relèvent du règlement européen sur les statistiques de court-terme (règlement CE dit « STS » n°1165/98 du conseil du 19 mai 1998, modifié par ses amendements ultérieurs).</p>',
		prefLabelLg1: 'Volume des ventes dans le commerce base 2015',
		abstractLg2:
			'<p>The sales volume indices are used to measure the monthly change in the sales volume of wholesale trade and retail trade. As such, they are a primary information to monitor the business cycle in France. Sales volume indices fall under the European regulation on short-terms statistics – the Council Regulation ‘’STS’’ No 1165/98 of 19 May 1998, modified by subsequent amendments.</p>',
		prefLabelLg2: 'Sales volume index in trade base 2015',
		creators: [],
		publishers: [],
		id: 'p1670',
		dataCollector: [],
		altLabelLg1: '',
	},
	{
		idSims: '1775',
		abstractLg1:
			'<p>Les indices de chiffre d\'affaires (ICA) en valeur dans le commerce permettent de mesurer mensuellement l\'&eacute;volution des ventes en valeur des entreprises relevant des secteurs concern&eacute;s.</p>\r\n<p>Ils rel&egrave;vent du r&egrave;glement europ&eacute;en sur les statistiques de court-terme (r&egrave;glement CE dit "&nbsp;STS&nbsp;" n&deg;1165/98 du conseil du 19 mai 1998, modifi&eacute; par ses amendements ult&eacute;rieurs).</p>',
		prefLabelLg1: "Indice de chiffre d'affaires dans le commerce",
		abstractLg2:
			'<p>Turnover indices in all trade are monthly indices in value. They  make possible to measure monthly the evolution of sales in value of the companies in the sectors concerned.</p><p>They fall under the European regulation on short-term statistics (Council Regulation (EC) No 1165/98 of 19 May 1998, as amended by its subsequent amendments).</p>',
		prefLabelLg2: 'Turnover index in trade',
		historyNoteLg2:
			'<p>In order to limit the statistical burden on businesses, and because information is collected on a regular basis by the tax authority, INSEE uses the value added tax (VAT) tax returns of companies to build a Monthly indices of turnover.</p><p>The tax authority transmits the VAT returns of companies to INSEE on a monthly basis.</p><p>Until 2015, turnover indices were calculated from a sample of companies reporting VAT on a monthly basis.</p><p>This sample, of some 160,000 companies, was renewed each year. It included an exhaustive stratum (the largest companies in each sector) and was drawn proportionally to turnover on the rest of the field.</p><p>Since 2016, all monthly returns are used to calculate the indices.</p>',
		creators: [],
		historyNoteLg1:
			"<p>Dans le souci de limiter la charge statistique pesant sur les entreprises, et parce que l'information est collectée de manière régulière par la DGFiP, l'Insee utilise les déclarations de taxe sur la valeur ajoutée (TVA) des entreprises pour bâtir un ensemble d'indices mensuels d'évolution des chiffres d'affaires.</p><p>La DGFiP transmet mensuellement à l'Insee les déclarations TVA des entreprises.</p><p>Jusqu'en 2015, les indices de chiffre d'affaires étaient calculés à partir d'un échantillon d'entreprises déclarant la TVA mensuellement.</p><p>Cet échantillon, de quelque 160 000 entreprises, était renouvelé chaque année. Il comprenait une strate exhaustive (les plus grandes entreprises de chaque secteur) et était tiré proportionnellement au chiffre d'affaires sur le reste du champ.</p><p>Depuis 2016, toutes les déclarations mensuelles sont exploitées pour le calcul des indices.</p>",
		publishers: [],
		id: 'p1634',
		dataCollector: [],
		altLabelLg1: '',
	},
	{
		idSims: '1790',
		abstractLg1:
			'<p>Les indices de volume des ventes dans l\'ensemble du commerce permettent de mesurer mensuellement l\'évolution des ventes des entreprises relevant des secteurs concernés.</p><p>Ils relèvent du règlement européen sur les statistiques de court-terme (règlement CE dit " STS " n°1165/98 du conseil du 19 mai 1998, modifié par ses amendements ultérieurs).</p>',
		prefLabelLg1: 'Volume des ventes dans le commerce base 2010',
		abstractLg2:
			'<p>Sales volume indices for all trade are monthly indices in volume: they track variations in the volume of sales of the companies in the sectors concerned.</p><p>They fall under the European regulation on short-term statistics (Council Regulation (EC) No 1165/98 of 19 May 1998, as amended by its subsequent amendments).</p>',
		prefLabelLg2: 'Sales volume index in trade base 2010',
		historyNoteLg2:
			'<p>In order to limit the statistical burden on businesses, and because information is collected on a regular basis by the tax authority, INSEE uses the value added tax (VAT) tax returns of companies to build a Monthly indices of turnover.</p><p>The tax authority transmits the VAT returns of companies to INSEE on a monthly basis.</p><p>Until 2015, turnover indices were calculated from a sample of companies reporting VAT on a monthly basis.</p><p>This sample, of some 160,000 companies, was renewed each year. It included an exhaustive stratum (the largest companies in each sector) and was drawn proportionally to turnover on the rest of the field.</p><p>Since 2016, all monthly returns are used to calculate the indices.</p><p>Beginning in 2017, INSEE calculates monthly indexes by volume in total trade by deflating the turnover indices in value: they trace the evolution of the volume of sales.</p>',
		creators: [],
		historyNoteLg1:
			"<p>Dans le souci de limiter la charge statistique pesant sur les entreprises, et parce que l'information est collectée de manière régulière par la DGFiP, l'Insee utilise les déclarations de taxe sur la valeur ajoutée (TVA) des entreprises pour bâtir un ensemble d'indices mensuels d'évolution des chiffres d'affaires.</p><p>La DGFiP transmet mensuellement à l'Insee les déclarations TVA des entreprises.</p><p>Jusqu'en 2015, les indices de chiffre d'affaires étaient calculés à partir d'un échantillon d'entreprises déclarant la TVA mensuellement.</p><p>Cet échantillon, de quelque 160 000 entreprises, était renouvelé chaque année. Il comprenait une strate exhaustive (les plus grandes entreprises de chaque secteur) et était tiré proportionnellement au chiffre d'affaires sur le reste du champ.</p><p>Depuis 2016, toutes les déclarations mensuelles sont exploitées pour le calcul des indices.</p><p>À partir de 2017 l'Insee calcule des indices mensuels en volume dans l'ensemble du commerce par déflation des indices de chiffres d'affaires en valeur : ils retracent l’évolution du volume des ventes.</p>",
		publishers: [],
		id: 'p1649',
		dataCollector: [],
		altLabelLg1: '',
	},
	{
		idSims: '1795',
		prefLabelLg1: 'Indice des prix à la consommation harmonisé',
		prefLabelLg2: 'Harmonised index of consumer prices',
		creators: [],
		dataCollector: [],
		abstractLg1:
			"<p>L'indice des prix à la consommation harmonisé (IPCH) est l'indicateur permettant d'apprécier le respect du critère de convergence portant sur la stabilité des prix, dans le cadre du traité de l'Union européenne (Maastricht).</p><p>Il est conçu expressément à des fins de comparaison internationale. L'IPCH ne remplace pas l'indice national qui reste l'indice de référence pour analyser l'inflation en France, avec l'indice d'inflation sous-jacente.</p>",
		abstractLg2:
			'<p>The harmonised index consumer prices (HICP) is the indicator used to assess compliance with the convergence criterion on price stability established in the European Union Treaty (Maastricht).</p><p>It was designed expressly for purposes of international comparison. The HICP has not replaced the national index, which remains the reference index used to analyse inflation in France, along with the core inflation index.</p>',
		historyNoteLg2:
			'<p>At the request of Eurostat, statistical institutes have supplied harmonised consumer price indices since 1996. Initially, the methods used by the 15 member states of the European Community to calculate their national price indices were distinctly different.</p><p>Bearing in mind the need to determine a threshold as important as inflation in the Economic and Monetary Union, they therefore could not be used to adequately compare inflation in these countries.</p><p>This is why the harmonised consumer price indices are is calculated using methods and content that ensure improved comparability.</p><p>In February 1996, INSEE published an interim consumer price index with a common scope for the 15 member countries, which was replaced in March 1997 by a harmonised price index, known as the HICP, with a common scope and methods.</p><p>This index, which began in January 1996, has been calculated since January 2016 with a base of 100 in 2015.</p>',
		historyNoteLg1:
			"<p>A la demande d'Eurostat, les instituts statistiques fournissent depuis 1996 des indices des prix à la consommation harmonisés. Au départ, les méthodes utilisées par les 15 états membres de la communauté européenne pour calculer leur indice de prix national étaient sensiblement différentes.</p><p>Elles ne permettaient donc pas, compte tenu de la détermination d'un seuil aussi important que celui de l'inflation dans l'Union économique et monétaire, de comparer correctement l'inflation de ces pays.</p><p>C'est pourquoi les indices de prix à la consommation harmonisés ont été calculés avec des méthodes et un contenu assurant une meilleure comparabilité.</p><p>L'Insee a publié en février 1996, un indice intérimaire des prix à la consommation sur un champ commun aux 15 pays membres qui a été remplacé en mars 1997 par un indice des prix harmonisé dit IPCH dont le champ et les méthodes sont communs.</p><p>Cet indice qui commence en janvier 1996 est calculé, depuis janvier 2016, en base 100 en 2015.</p>",
		publishers: [],
		id: 'p1654',
		altLabelLg2: 'HICP',
		altLabelLg1: 'IPCH',
	},
	{
		idSims: '1777',
		abstractLg1:
			'<p>Les indices de chiffre d’affaires (ICA) dans l’industrie et la construction permettent de mesurer mensuellement l’évolution des ventes en valeur, y compris à l’export, des entreprises relevant des secteurs concernés.</p><p>Les indices de chiffre d’affaires dans l’industrie et la construction répondent à un impératif national et européen.</p><p>Ils relèvent du règlement européen sur les statistiques de court-terme (règlement CE dit « STS » n°1165/98 du conseil du 19 mai 1998, modifié par ses amendements ultérieurs).</p>',
		prefLabelLg1:
			"Indice de chiffre d'affaires dans l'industrie et la construction",
		abstractLg2:
			'<p>The Turnover Indices (ICA) in Industry and Construction allow the monthly measure of evolution in the value of sales in the sectors concerned, including exports.</p><p>The turnover indices in Industry and Construction focus  on a national and European need.</p><p>They are subject to the European regulation on short-term statistics (EC "STS" regulation n°1165/98 of the Council of May 19, 1998, modified by subsequent amendments). </p>',
		prefLabelLg2: 'Sales Index in Industry and Construction',
		historyNoteLg2:
			"<p>In order to reduce the statistical burden on businesses and because the data has been collected on a regular basis, INSEE obtained the ability to use businesses' value-added tax (VAT) declarations in order to calculate a set of monthly indices showing the evolution of turnover.</p><p>The Tax General Directorate transmits to the INSEE the declarations of VAT. Until 2015, the index of turnover were calculated from a sample of companies declaring the VAT monthly, selected by INSEE.This sample of almost 160 000 companies was renewed on an annual basis. It includes an exhaustive section (the largest businesses in each sector) and is selected in proportion of the turnover over the rest of the field.</p><p>From 2016, all the monthly declarations are exploited for the calculation of the indices.</p>",
		creators: [],
		historyNoteLg1:
			"<p>Dans le souci de limiter la charge statistique pesant sur les entreprises, et que l'information était collectée de manière régulière, l'Insee a obtenu de pouvoir utiliser les déclarations de taxe sur la valeur ajoutée (TVA) des entreprises pour bâtir un ensemble d'indices mensuels d'évolution des chiffres d'affaires.</p><p>La DGFiP transmet donc à l'Insee les déclarations TVA des entreprises. Jusqu'en 2015, les indices de chiffre d'affaires étaient calculés à partir d'un échantillon d'entreprises déclarant la TVA mensuellement sélectionnées par l'Insee.Cet échantillon, de quelque 160 000 entreprises, était renouvelé chaque année. Il comprenait une strate exhaustive (les plus grandes entreprises de chaque secteur) et était tiré proportionnellement au chiffre d'affaires sur le reste du champ.</p><p>À partir de 2016, toutes les déclarations mensuelles sont exploitées pour le calcul des indices. </p>",
		publishers: [],
		id: 'p1636',
		dataCollector: [],
		altLabelLg1: '',
	},
	{
		idSims: '1801',
		abstractLg1:
			"<p>Estimer des taux de chômage localisés par région, département et zone d'emploi.</p>",
		prefLabelLg1:
			"Taux de chômage localisés (par régions, départements et zones d'emploi)",
		abstractLg2:
			'<p>To estimate localised unemployment rates by region, department and employment area.</p>',
		prefLabelLg2:
			'Localised unemployment rates (by region, department and employment area)',
		historyNoteLg2:
			'<p>Previously quarterly unemployment rates by region and department were relative to the situation at the end of quarter and estimated from the series of jobseekers at the end of month (DEFM).</p><p>The use of the DEFM at national level was abandoned from 2008 in favour of exclusive use of the Labour Force Survey for the calculation of the unemployment rate in the sense of the ILO.</p><p>The series of regional and departmental unemployment rates are now estimated as quarterly means. Furthermore, the French interpretation of ILO unemployment was abandoned in favour of the European interpretation.</p><p>The localised unemployment rate methodology was therefore adapted at localised level to take account of these changes.</p><p>The name "unemployment in the sense of the ILO" was also abandoned for these series in favour of the new name "localised unemployment rate"; these series in fact synthesise the information from employment estimates, the Labour Force Survey (unemployment in the sense of the ILO) and the DEFM (registered unemployment).</p>',
		creators: [],
		historyNoteLg1:
			"<p>Alors qu'auparavant les taux de chômage par région et département produits trimestriellement étaient relatifs à la situation en fin de trimestre et estimés à partir des séries de demandeurs d'emploi en fin de mois (DEFM), l'utilisation des DEFM au niveau national a été abandonnée à partir de 2008 au profit d'une utilisation exclusive de l'enquête Emploi en continu pour le calcul du taux de chômage au sens du BIT.</p><p>Les séries de taux de chômage régionaux et départementaux sont désormais estimées en moyenne trimestrielle. De plus, l'interprétation française du chômage BIT a été abandonnée au profit de l'interprétation européenne.</p><p>La méthodologie des taux de chômage localisés a donc été adaptée au niveau local pour tenir compte de ces changements.</p><p>Par ailleurs, la dénomination \"chômage au sens du BIT\" a été abandonnée pour ces séries au profit de la nouvelle dénomination \"taux de chômage localisés\" ; en effet ces données sont issues d’une synthèse de différentes sources : des données administratives sur l’emploi ; des séries de demandeurs d’emploi inscrits en fin de mois (DEFM) à Pôle emploi ; de l’enquête Emploi.</p>",
		publishers: [],
		id: 'p1660',
		dataCollector: [],
		altLabelLg1: '',
	},
	{
		idSims: '1772',
		abstractLg1:
			"<p>Les statistiques des créations d'entreprises permettent de suivre l'évolution des créations d'entreprises relevant des principaux secteurs d'activité.</p>",
		prefLabelLg1: "Créations d'entreprises",
		abstractLg2:
			'<p>Business start-up statistics serve for the monitoring of the business start-up trends in the main sectors.</p>',
		prefLabelLg2: 'Business start-ups',
		creators: [],
		publishers: [],
		id: 'p1631',
		dataCollector: [],
		altLabelLg1: '',
	},
	{
		idSims: '1789',
		abstractLg1:
			"<p>L'indice de traitement brut - grille indiciaire (ITB-GI) vise à mesurer les évolutions du traitement brut des agents de la Fonction publique de l'État, pour chaque catégorie (A, B et C).</p><p>Le traitement brut d'un agent est le produit de son indice par la valeur du point Fonction publique.</p>",
		prefLabelLg1: 'Indice de traitement brut / grille indiciaire',
		abstractLg2:
			'<p>The purpose of the Gross Salary Index - Index-Based Scale (ITB-GI) is to measure the trends in the gross salaries of French civil servants, for each category (A, B and C).</p><p>The gross salary of a civil servant is the product of its index and the Civil Service "point value".</p>',
		prefLabelLg2: 'Gross Salary Index / Index-Based Scale',
		creators: [],
		publishers: [],
		id: 'p1648',
		altLabelLg2: 'ITB / GI',
		dataCollector: [],
		altLabelLg1: 'ITB / GI',
	},
	{
		idSims: '1800',
		prefLabelLg1: 'Indice de référence des loyers',
		prefLabelLg2: 'Rent Reference Index',
		creators: [],
		dataCollector: [],
		abstractLg1:
			"<p>L'indice de référence des loyers (IRL) vise à garantir aux locataires des hausses de loyers en rapport avec leur évolution du pouvoir d'achat et aux bailleurs le maintien d'un niveau d'entretien élevé et aussi à ne pas les dissuader d'investir dans le logement locatif.</p>",
		abstractLg2:
			'<p>The purpose of the Rent Reference Index (IRL) is to provide tenants with a guarantee that rents will rise in relation to trends in purchasing power, and to provide lessors with a guarantee of a high level of maintenance and not dissuade them from investing in rental housing.</p>',
		historyNoteLg2:
			'<p>Article 9 of Law no. 2008-111 of 8 February 2008 for purchasing power amended the rent reference created by article 35 of the Law 2005-841 of 26 July 2005 relating to the development of personal services and including a variety of measures to promote social cohesion.</p><p>The Rent Reference Index replaces the rent reference index that was previously calculated as a reference for rent reviews relating to current leases in private housing stock.</p>',
		historyNoteLg1:
			"<p>L'article 9 de la loi n° 2008-111 du 8 février 2008 pour le pouvoir d'achat a modifié l'indice de référence des loyers créé par l'article 35 de la loi 2005-841 du 26 juillet 2005 relative au développement des services à la personne et portant diverses mesures en faveur de la cohésion sociale.</p><p>L'indice de référence des loyers se substitue à l'indice de référence des loyers précédemment calculé comme référence pour la révision des loyers en cours de bail dans le parc locatif privé.</p>",
		publishers: [],
		id: 'p1659',
		altLabelLg2: 'IRL',
		altLabelLg1: 'IRL',
	},
];
const organisations = [{ id: 'DG75-L002', label: 'DG75-L002' }];
const stamps = ['DG57-C003', 'DG57-C060'];
const categories = { codes: [] };
describe('<SearchFormList />', () => {
	it('should return all data when the form is empty', () => {
		const { container } = render(
			<MemoryRouter>
				<SearchFormList
					data={data}
					organisations={organisations}
					stamps={stamps}
					categories={categories}
				/>
			</MemoryRouter>
		);
		expect(container.querySelectorAll('li')).toHaveLength(16);
	});
	it('should filter by prefLabelLg1', () => {
		const { container } = render(
			<MemoryRouter>
				<SearchFormList
					data={data}
					organisations={organisations}
					stamps={stamps}
					categories={categories}
				/>
			</MemoryRouter>
		);
		const input = container.querySelector('input');
		fireEvent.change(input, { target: { value: 'Indice de production' } });
		expect(container.querySelectorAll('li')).toHaveLength(2);
	});
	it('should filter by creators', async () => {
		const { container, findByText } = render(
			<MemoryRouter>
				<SearchFormList
					data={data}
					organisations={organisations}
					stamps={stamps}
					categories={categories}
				/>
			</MemoryRouter>
		);

		const listOptions = container.querySelector('label[for="creator"] input');
		fireEvent.keyDown(listOptions, { key: 'ArrowDown' });
		const option = await findByText('DG57-C060');
		fireEvent.click(option);
		expect(container.querySelectorAll('li')).toHaveLength(1);
	});
	it('should filter by publishers', async () => {
		const { container, findByText } = render(
			<MemoryRouter>
				<SearchFormList
					data={data}
					organisations={organisations}
					stamps={stamps}
					categories={categories}
				/>
			</MemoryRouter>
		);

		const listOptions = container.querySelector('label[for="publisher"] input');
		fireEvent.keyDown(listOptions, { key: 'ArrowDown' });
		const option = await findByText('DG75-L002');
		fireEvent.click(option);
		expect(container.querySelectorAll('li')).toHaveLength(1);
	});
});
