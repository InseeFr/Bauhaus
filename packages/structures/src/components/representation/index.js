import D from '../../i18n/build-dictionary';
import { XSD_TYPES } from '../../utils/constants';
import React from 'react';

const Representation = ({ component, codesLists, handleCodesListDetail, readOnly }) => {
	const codeList =  codesLists.find(
		({ id }) => id?.toString() === component.codeList?.toString()
	)?.label;

	if(codeList){
		return <>
			{codeList}
			{!readOnly && codeList && <button
				className="codes-list-detail"
				onClick={handleCodesListDetail}
				aria-label={D.seeCodesListDetails}
				title={D.seeCodesListDetails}>
				<span className="glyphicon glyphicon-th"></span>
			</button>}

		</>
	}

	return XSD_TYPES.find(range => component.range === range.value)?.label || '';
}

export default Representation;
