import React from 'react';
import PropTypes from 'prop-types';
import PageTitle from 'js/components/shared/page-title';
import PageSubtitle from 'js/components/shared/page-subtitle';

function PageTitleBlock({ titleLg1, titleLg2, secondLang, context }) {
	return (
		<>
			<PageTitle title={titleLg1} context={context} />
			{secondLang && titleLg2 && (
				<PageSubtitle subTitle={titleLg2} context="operations" />
			)}
		</>
	);
}

PageTitleBlock.proptTypes = {
	titleLg1: PropTypes.string.isRequired,
	titleLg2: PropTypes.string.isRequired,
	secondLang: PropTypes.bool,
	context: PropTypes.oneOf(['', 'concepts', 'classifications', 'operations']),
};

export default PageTitleBlock;
