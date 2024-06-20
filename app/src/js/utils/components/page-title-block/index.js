import React from 'react';

function PageTitleBlock({ titleLg1, titleLg2, secondLang }) {
	return (
		<>
			<div className="row wilco-page-title">
				<div className={`col-md-10 wilco-page-title__block col-md-offset-1`}>
					<h2 className="wilco-page-title__title ">
						{titleLg1}
						{secondLang && titleLg2 && <div>&quot; {titleLg2} &quot;</div>}
					</h2>
				</div>
			</div>
		</>
	);
}

export default PageTitleBlock;
