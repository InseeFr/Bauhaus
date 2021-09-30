import React from 'react';
import Edition from '../component';
import { useTitle } from 'bauhaus-utilities';
import D from 'js/i18n';

const Create = () => {
	useTitle(D.structuresTitle, D.structuresCreateTitle)
	return <Edition creation={true} />;
};

export default Create;
