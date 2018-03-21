import React from 'react';
import flag from 'js/components/shared/flag';

export default ({ text, lang }) => (
	<div>
		{text + '  ( '}
		{flag(lang)} )
	</div>
);
