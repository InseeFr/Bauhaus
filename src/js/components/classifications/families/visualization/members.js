import React from 'react';
import SearchRmes from 'js/components/shared/search-rmes';
import Panel from 'js/components/shared/panel';
import D from 'js/i18n';

export default ({ members }) => (
	<Panel title={D.childrenSeries} context="classifications">
		<div className="col-md-8 col-md-offset-2 centered">
			<SearchRmes
				items={members}
				childPath="classifications/series"
				context="classifications"
			/>
		</div>
	</Panel>
);
