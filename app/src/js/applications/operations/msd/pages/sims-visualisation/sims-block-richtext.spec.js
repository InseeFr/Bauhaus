import React from "react";
import SimsBlockRichText from "./sims-block-richtext";
import { render } from '@testing-library/react';

const documents = {
	documentsLg1: [{
		labelLg1: 'Page 1',
		labelLg2: 'Page 2',
		uri: '/page/1'
	}, {
		labelLg1: 'Document 1',
		labelLg2: 'Document 2',
		uri: '/document/1'
	}],
	documentsLg2: [{
		labelLg1: 'Page 1',
		labelLg2: 'Page 2',
		uri: '/page/1'
	}, {
		labelLg1: 'Document 1',
		labelLg2: 'Document 2',
		uri: '/document/1'
	}]
}
describe("<SimsBlockRichText />", () => {
	it("should display link/document Lg1", () => {
		const { container } = render(<SimsBlockRichText currentSection={documents} isSecondLang={false}/>)
		expect(container.querySelector(".documentsbloc:nth-child(2) a").innerHTML).toBe('Document 1');
		expect(container.querySelector(".documentsbloc:nth-child(4) a").innerHTML).toBe('Page 1');

	})
	it("should display link/document Lg2", () => {
		const { container } = render(<SimsBlockRichText currentSection={documents} isSecondLang={true}/>);
		console.log(container.innerHTML)

		expect(container.querySelector(".documentsbloc:nth-child(2) a").innerHTML).toBe('Document 2');
		expect(container.querySelector(".documentsbloc:nth-child(4) a").innerHTML).toBe('Page 2');
	})
})